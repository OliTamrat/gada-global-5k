import { query, queryOne, transaction } from "@/lib/db";
import { coerceWave, WAVES, type Wave } from "@/lib/waves";

export interface RaceEntry {
  bib: number;
  wave: Wave;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  startTime?: number;
  finishTime?: number;
  // Multi-volunteer consensus timing
  scanLogs: ScanLog[];
  timingConfidence?: "high" | "medium" | "low";
}

export interface ScanLog {
  timestamp: number;
  type: "start" | "finish";
  volunteerId: string;
}

export interface Dispute {
  id: string;
  bib: number;
  runnerName: string;
  reason: string;
  submittedAt: number;
  status: "pending" | "accepted" | "rejected";
  resolution?: string;
  resolvedAt?: number;
  originalTime?: number;
  adjustedTime?: number;
  evidence?: string[]; // base64 data URLs of uploaded photos
}

export interface RaceResult extends RaceEntry {
  netTime?: number;
  pace?: string;
  position?: number;
}

// Unique violation — a volunteer scanning the same bib twice.
const PG_UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === PG_UNIQUE_VIOLATION
  );
}

// ── Row shapes ───────────────────────────────────────────────────────────────
interface EntryRow {
  bib: number;
  wave: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  start_time: number | null;
  finish_time: number | null;
  timing_confidence: "high" | "medium" | "low" | null;
  scan_logs: ScanLog[];
}

interface DisputeRow {
  id: string;
  bib: number;
  runner_name: string;
  reason: string;
  submitted_at: number;
  status: "pending" | "accepted" | "rejected";
  resolution: string | null;
  resolved_at: number | null;
  original_time: number | null;
  adjusted_time: number | null;
  evidence: string[];
}

function toEntry(row: EntryRow): RaceEntry {
  return {
    bib: row.bib,
    wave: coerceWave(row.wave),
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
    gender: row.gender,
    startTime: row.start_time ?? undefined,
    finishTime: row.finish_time ?? undefined,
    timingConfidence: row.timing_confidence ?? undefined,
    scanLogs: row.scan_logs ?? [],
  };
}

function toDispute(row: DisputeRow): Dispute {
  return {
    id: row.id,
    bib: row.bib,
    runnerName: row.runner_name,
    reason: row.reason,
    submittedAt: row.submitted_at,
    status: row.status,
    resolution: row.resolution ?? undefined,
    resolvedAt: row.resolved_at ?? undefined,
    originalTime: row.original_time ?? undefined,
    adjustedTime: row.adjusted_time ?? undefined,
    evidence: row.evidence ?? [],
  };
}

const ENTRY_SELECT = `
  select
    e.bib, e.first_name, e.last_name, e.age, e.gender, e.wave,
    e.start_time, e.finish_time, e.timing_confidence,
    coalesce(
      json_agg(
        json_build_object(
          'timestamp', s.timestamp_ms,
          'type', s.type,
          'volunteerId', s.volunteer_id
        ) order by s.timestamp_ms
      ) filter (where s.id is not null),
      '[]'
    ) as scan_logs
  from race_entries e
  left join scan_logs s on s.bib = e.bib
`;

// ── Seed demo ────────────────────────────────────────────────────────────────
const demoRunners = [
  { bib: 1, firstName: "Lelisa", lastName: "Desisa", age: 28, gender: "Male" },
  { bib: 2, firstName: "Almaz", lastName: "Ayana", age: 25, gender: "Female" },
  { bib: 3, firstName: "Tamirat", lastName: "Tola", age: 30, gender: "Male" },
  { bib: 4, firstName: "Letesenbet", lastName: "Gidey", age: 24, gender: "Female" },
  { bib: 5, firstName: "Selemon", lastName: "Barega", age: 22, gender: "Male" },
  { bib: 6, firstName: "Gudaf", lastName: "Tsegay", age: 27, gender: "Female" },
  { bib: 7, firstName: "Yomif", lastName: "Kejelcha", age: 26, gender: "Male" },
  { bib: 8, firstName: "Hellen", lastName: "Obiri", age: 32, gender: "Female" },
  { bib: 9, firstName: "Mohammed", lastName: "Ahmed", age: 29, gender: "Male" },
  { bib: 10, firstName: "Sifan", lastName: "Hassan", age: 28, gender: "Female" },
  { bib: 11, firstName: "Abdi", lastName: "Nageeye", age: 31, gender: "Male" },
  { bib: 12, firstName: "Tsehay", lastName: "Gemechu", age: 23, gender: "Female" },
];

/** Resets timing data to a demo race. Only touches the seeded bib range. */
export async function seedDemoData(): Promise<RaceEntry[]> {
  const raceStart = Date.now() - 25 * 60 * 1000;
  const finishOffsets = [
    15 * 60 + 23, 17 * 60 + 45, 18 * 60 + 12, 19 * 60 + 8,
    20 * 60 + 33, 21 * 60 + 15, 23 * 60 + 48, 25 * 60 + 2,
  ];
  const demoBibs = demoRunners.map((r) => r.bib);

  await transaction(async (client) => {
    // scan_logs and disputes cascade from race_entries.
    await client.query("delete from race_entries where bib = any($1::int[])", [demoBibs]);

    for (const [i, runner] of demoRunners.entries()) {
      const finished = i < 8;
      const finishTime = finished ? raceStart + finishOffsets[i] * 1000 : null;
      // First four get a second volunteer scan, so they reach high confidence.
      const confidence = !finished ? "high" : i < 4 ? "high" : "medium";

      await client.query(
        `insert into race_entries
           (bib, first_name, last_name, age, gender, start_time, finish_time, timing_confidence)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          runner.bib, runner.firstName, runner.lastName, runner.age,
          runner.gender, raceStart, finishTime, confidence,
        ]
      );

      await client.query(
        `insert into scan_logs (bib, type, volunteer_id, timestamp_ms)
         values ($1, 'start', 'demo', $2)`,
        [runner.bib, raceStart]
      );

      if (finishTime !== null) {
        await client.query(
          `insert into scan_logs (bib, type, volunteer_id, timestamp_ms)
           values ($1, 'finish', 'vol-1', $2)`,
          [runner.bib, finishTime]
        );
        if (i < 4) {
          await client.query(
            `insert into scan_logs (bib, type, volunteer_id, timestamp_ms)
             values ($1, 'finish', 'vol-2', $2)`,
            [runner.bib, finishTime + 300]
          );
        }
      }
    }
  });

  return getRaceEntries();
}

export interface WaveStatus {
  wave: Wave;
  startedAt?: number;
  startedBy?: string;
  /** Runners assigned to this wave. */
  registered: number;
  finished: number;
}

/**
 * Sends a wave. One tap gives every runner in it the same start time.
 *
 * Idempotent by design: the primary key on wave_starts means a second tap
 * returns the original timestamp rather than restarting a wave that is already
 * running. A volunteer double-tapping under pressure must not reset the clock
 * on runners already on the course.
 */
export async function startWave(
  wave: Wave,
  volunteerId: string
): Promise<{ started: boolean; startedAt: number; alreadyStarted: boolean }> {
  const now = Date.now();

  return transaction(async (client) => {
    const claim = await client.query<{ started_at: number }>(
      `insert into wave_starts (wave, started_at, started_by)
       values ($1, $2, $3)
       on conflict (wave) do nothing
       returning started_at`,
      [wave, now, volunteerId]
    );

    if (claim.rowCount === 0) {
      const existing = await client.query<{ started_at: number }>(
        "select started_at from wave_starts where wave = $1",
        [wave]
      );
      return {
        started: false,
        startedAt: existing.rows[0].started_at,
        alreadyStarted: true,
      };
    }

    // Only fills blanks, so a runner given an individual start time (a late
    // starter corrected by an official) keeps it.
    await client.query(
      "update race_entries set start_time = $2 where wave = $1 and start_time is null",
      [wave, now]
    );

    return { started: true, startedAt: now, alreadyStarted: false };
  });
}

/** Per-wave counts and start state, for the starter's screen. */
export async function getWaveStatuses(): Promise<WaveStatus[]> {
  const rows = await query<{
    wave: string;
    started_at: number | null;
    started_by: string | null;
    registered: number;
    finished: number;
  }>(
    `select
       w.wave,
       ws.started_at,
       ws.started_by,
       count(e.bib)                                          as registered,
       count(e.bib) filter (where e.finish_time is not null)  as finished
     from unnest($1::text[]) as w(wave)
     left join wave_starts ws on ws.wave = w.wave
     left join race_entries e on e.wave = w.wave
     group by w.wave, ws.started_at, ws.started_by`,
    [WAVES as unknown as string[]]
  );

  const byWave = new Map(rows.map((r) => [r.wave, r]));
  return WAVES.map((wave) => {
    const r = byWave.get(wave);
    return {
      wave,
      startedAt: r?.started_at ?? undefined,
      startedBy: r?.started_by ?? undefined,
      registered: Number(r?.registered ?? 0),
      finished: Number(r?.finished ?? 0),
    };
  });
}

export async function getRaceEntries(): Promise<RaceEntry[]> {
  const rows = await query<EntryRow>(`${ENTRY_SELECT} group by e.bib order by e.bib`);
  return rows.map(toEntry);
}

export async function getRaceEntry(bib: number): Promise<RaceEntry | null> {
  const row = await queryOne<EntryRow>(
    `${ENTRY_SELECT} where e.bib = $1 group by e.bib`,
    [bib]
  );
  return row ? toEntry(row) : null;
}

/** Adds a runner to the timing roster. Idempotent on bib. */
export async function upsertRaceEntry(entry: {
  bib: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  wave: Wave;
}): Promise<void> {
  // start_time is seeded from wave_starts so someone who registers on race day,
  // after their wave has already been sent, still has a clock running.
  await query(
    `insert into race_entries (bib, first_name, last_name, age, gender, wave, start_time)
     values ($1, $2, $3, $4, $5, $6,
             (select started_at from wave_starts where wave = $6))
     on conflict (bib) do update set
       first_name = excluded.first_name,
       last_name  = excluded.last_name,
       age        = excluded.age,
       gender     = excluded.gender,
       wave       = excluded.wave`,
    [entry.bib, entry.firstName, entry.lastName, entry.age, entry.gender, entry.wave]
  );
}

// ── Multi-volunteer consensus scan ───────────────────────────────────────────
export async function recordScan(
  bib: number,
  type: "start" | "finish",
  volunteerId: string = "vol-1"
): Promise<{ success: boolean; entry?: RaceEntry; error?: string; consensus?: string }> {
  const now = Date.now();

  try {
    return await transaction(async (client) => {
      // Lock the row so two volunteers scanning at once cannot interleave
      // the read-compute-write below.
      const locked = await client.query<{ start_time: number | null }>(
        "select start_time from race_entries where bib = $1 for update",
        [bib]
      );

      if (locked.rowCount === 0) {
        return { success: false, error: `Bib #${bib} not found` };
      }

      const startTime = locked.rows[0].start_time;

      if (type === "start") {
        if (startTime !== null) {
          return { success: false, error: `Bib #${bib} already started` };
        }
        await client.query("update race_entries set start_time = $2 where bib = $1", [bib, now]);
        await client.query(
          `insert into scan_logs (bib, type, volunteer_id, timestamp_ms)
           values ($1, 'start', $2, $3)`,
          [bib, volunteerId, now]
        );
        const entry = await readEntry(client, bib);
        return { success: true, entry };
      }

      // Finish scan — supports multiple volunteers.
      //
      // Runners are not scanned at the start, so a null start_time normally
      // just means this runner registered after their wave was sent. Inherit
      // the wave's timestamp rather than rejecting the scan: a volunteer at a
      // finish line has no way to fix a missing start, and turning a finisher
      // away loses their result entirely.
      let effectiveStart = startTime;
      if (effectiveStart === null) {
        const waveRow = await client.query<{ started_at: number }>(
          `select w.started_at
             from wave_starts w
             join race_entries e on e.wave = w.wave
            where e.bib = $1`,
          [bib]
        );
        if (waveRow.rowCount === 0) {
          return {
            success: false,
            error: `Bib #${bib}'s wave has not been started yet`,
          };
        }
        effectiveStart = waveRow.rows[0].started_at;
        await client.query("update race_entries set start_time = $2 where bib = $1", [
          bib,
          effectiveStart,
        ]);
      }

      await client.query(
        `insert into scan_logs (bib, type, volunteer_id, timestamp_ms)
         values ($1, 'finish', $2, $3)`,
        [bib, volunteerId, now]
      );

      const finishScans = await client.query<{ timestamp_ms: number }>(
        "select timestamp_ms from scan_logs where bib = $1 and type = 'finish'",
        [bib]
      );
      const timestamps = finishScans.rows.map((r) => r.timestamp_ms);

      if (timestamps.length === 1) {
        await client.query(
          "update race_entries set finish_time = $2, timing_confidence = 'medium' where bib = $1",
          [bib, now]
        );
        const entry = await readEntry(client, bib);
        return { success: true, entry, consensus: "1 volunteer — medium confidence" };
      }

      const avg = Math.round(timestamps.reduce((a, b) => a + b, 0) / timestamps.length);
      const maxDiff = Math.max(...timestamps) - Math.min(...timestamps);
      const confidence = maxDiff > 3000 ? "low" : "high";

      await client.query(
        "update race_entries set finish_time = $2, timing_confidence = $3 where bib = $1",
        [bib, avg, confidence]
      );
      const entry = await readEntry(client, bib);

      return {
        success: true,
        entry,
        consensus:
          confidence === "low"
            ? `${timestamps.length} volunteers — LOW confidence (${(maxDiff / 1000).toFixed(1)}s spread). Review recommended.`
            : `${timestamps.length} volunteers — HIGH confidence (${(maxDiff / 1000).toFixed(1)}s spread)`,
      };
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { success: false, error: `Volunteer ${volunteerId} already scanned Bib #${bib}` };
    }
    throw err;
  }
}

async function readEntry(
  client: import("pg").PoolClient,
  bib: number
): Promise<RaceEntry | undefined> {
  const result = await client.query<EntryRow>(
    `${ENTRY_SELECT} where e.bib = $1 group by e.bib`,
    [bib]
  );
  return result.rows[0] ? toEntry(result.rows[0]) : undefined;
}

// ── Disputes ─────────────────────────────────────────────────────────────────
export async function getDisputes(): Promise<Dispute[]> {
  const rows = await query<DisputeRow>("select * from disputes order by submitted_at desc");
  return rows.map(toDispute);
}

export async function createDispute(d: {
  bib: number;
  reason: string;
  evidence?: string[];
}): Promise<{ success: boolean; dispute?: Dispute; error?: string }> {
  const entry = await queryOne<{
    first_name: string;
    last_name: string;
    start_time: number | null;
    finish_time: number | null;
  }>(
    "select first_name, last_name, start_time, finish_time from race_entries where bib = $1",
    [d.bib]
  );

  if (!entry) return { success: false, error: "Runner not found" };

  const originalTime =
    entry.finish_time !== null && entry.start_time !== null
      ? entry.finish_time - entry.start_time
      : null;

  try {
    const row = await queryOne<DisputeRow>(
      `insert into disputes
         (id, bib, runner_name, reason, submitted_at, status, original_time, evidence)
       values ($1, $2, $3, $4, $5, 'pending', $6, $7::jsonb)
       returning *`,
      [
        `DSP-${Date.now()}`,
        d.bib,
        `${entry.first_name} ${entry.last_name}`,
        d.reason,
        Date.now(),
        originalTime,
        // Must be stringified: node-postgres would otherwise send a JS array
        // as a Postgres array literal, which jsonb rejects.
        JSON.stringify(d.evidence ?? []),
      ]
    );
    return { success: true, dispute: row ? toDispute(row) : undefined };
  } catch (err) {
    // The partial unique index on (bib) where status = 'pending'.
    if (isUniqueViolation(err)) {
      return { success: false, error: "A dispute is already pending for this bib" };
    }
    throw err;
  }
}

export async function resolveDispute(
  disputeId: string,
  action: "accepted" | "rejected",
  resolution: string,
  adjustedMs?: number
): Promise<{ success: boolean; error?: string }> {
  return transaction(async (client) => {
    const found = await client.query<{ bib: number; status: string }>(
      "select bib, status from disputes where id = $1 for update",
      [disputeId]
    );

    if (found.rowCount === 0) return { success: false, error: "Dispute not found" };
    if (found.rows[0].status !== "pending") {
      return { success: false, error: "Dispute already resolved" };
    }

    const applyAdjustment = action === "accepted" && adjustedMs !== undefined;

    await client.query(
      `update disputes
         set status = $2, resolution = $3, resolved_at = $4,
             adjusted_time = coalesce($5, adjusted_time)
       where id = $1`,
      [disputeId, action, resolution, Date.now(), applyAdjustment ? adjustedMs : null]
    );

    if (applyAdjustment) {
      await client.query(
        `update race_entries
           set finish_time = start_time + $2
         where bib = $1 and start_time is not null`,
        [found.rows[0].bib, adjustedMs]
      );
    }

    return { success: true };
  });
}

// ── Formatting ───────────────────────────────────────────────────────────────
export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function calcPace(ms: number): string {
  const totalMinutes = ms / 60000;
  const pacePerMile = totalMinutes / 3.1;
  const mins = Math.floor(pacePerMile);
  const secs = Math.round((pacePerMile - mins) * 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function computeResults(entries: RaceEntry[]): RaceResult[] {
  const finished: RaceResult[] = entries
    .filter((e) => e.startTime && e.finishTime)
    .map((e) => ({ ...e, netTime: e.finishTime! - e.startTime! }))
    .sort((a, b) => a.netTime! - b.netTime!);

  const inProgress: RaceResult[] = entries
    .filter((e) => e.startTime && !e.finishTime)
    .map((e) => ({ ...e }));

  const notStarted: RaceResult[] = entries
    .filter((e) => !e.startTime)
    .map((e) => ({ ...e }));

  finished.forEach((e, i) => {
    e.position = i + 1;
    e.pace = calcPace(e.netTime!);
  });

  return [...finished, ...inProgress, ...notStarted];
}

export function getAgeGroup(age: number) {
  if (age < 20) return "14-19";
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  return "50+";
}
