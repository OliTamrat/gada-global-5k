export interface RaceEntry {
  bib: number;
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

// ── In-memory stores ──
const demoRunners: Omit<RaceEntry, "scanLogs">[] = [
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

let raceEntries: RaceEntry[] | null = null;
let disputes: Dispute[] = [];

function getEntries(): RaceEntry[] {
  if (!raceEntries) raceEntries = [];
  return raceEntries;
}

// ── Seed demo ──
export function seedDemoData(): RaceEntry[] {
  const raceStart = Date.now() - 25 * 60 * 1000;
  const finishOffsets = [
    15 * 60 + 23, 17 * 60 + 45, 18 * 60 + 12, 19 * 60 + 8,
    20 * 60 + 33, 21 * 60 + 15, 23 * 60 + 48, 25 * 60 + 2,
  ];

  raceEntries = demoRunners.map((r, i) => {
    const entry: RaceEntry = { ...r, scanLogs: [], timingConfidence: "high" };
    entry.startTime = raceStart;
    entry.scanLogs.push({ timestamp: raceStart, type: "start", volunteerId: "demo" });
    if (i < 8) {
      const ft = raceStart + finishOffsets[i] * 1000;
      entry.finishTime = ft;
      // Simulate 2 volunteers for first 4 (high confidence), 1 for rest
      entry.scanLogs.push({ timestamp: ft, type: "finish", volunteerId: "vol-1" });
      if (i < 4) {
        entry.scanLogs.push({ timestamp: ft + 300, type: "finish", volunteerId: "vol-2" });
        entry.timingConfidence = "high";
      } else {
        entry.timingConfidence = "medium";
      }
    }
    return entry;
  });

  disputes = [];
  return raceEntries;
}

export function getRaceEntries(): RaceEntry[] {
  return getEntries();
}

// ── Multi-volunteer consensus scan ──
export function recordScan(
  bib: number,
  type: "start" | "finish",
  volunteerId: string = "vol-1"
): { success: boolean; entry?: RaceEntry; error?: string; consensus?: string } {
  const entries = getEntries();
  const entry = entries.find((e) => e.bib === bib);

  if (!entry) {
    return { success: false, error: `Bib #${bib} not found` };
  }

  const now = Date.now();
  const log: ScanLog = { timestamp: now, type, volunteerId };

  if (type === "start") {
    if (entry.startTime) {
      return { success: false, error: `Bib #${bib} already started` };
    }
    entry.startTime = now;
    entry.scanLogs.push(log);
    return { success: true, entry };
  }

  // Finish scan — support multi-volunteer
  if (!entry.startTime) {
    return { success: false, error: `Bib #${bib} hasn't started yet` };
  }

  // Check if this volunteer already scanned this bib's finish
  const alreadyScanned = entry.scanLogs.some(
    (l) => l.type === "finish" && l.volunteerId === volunteerId
  );
  if (alreadyScanned) {
    return { success: false, error: `Volunteer ${volunteerId} already scanned Bib #${bib}` };
  }

  entry.scanLogs.push(log);

  const finishScans = entry.scanLogs.filter((l) => l.type === "finish");

  if (finishScans.length === 1) {
    // First scan — set finish time
    entry.finishTime = now;
    entry.timingConfidence = "medium";
    return { success: true, entry, consensus: "1 volunteer — medium confidence" };
  }

  // Multiple scans — compute consensus
  const timestamps = finishScans.map((l) => l.timestamp);
  const avg = Math.round(timestamps.reduce((a, b) => a + b, 0) / timestamps.length);
  const maxDiff = Math.max(...timestamps) - Math.min(...timestamps);

  entry.finishTime = avg;

  if (maxDiff > 3000) {
    entry.timingConfidence = "low";
    return {
      success: true,
      entry,
      consensus: `${finishScans.length} volunteers — LOW confidence (${(maxDiff / 1000).toFixed(1)}s spread). Review recommended.`,
    };
  } else if (finishScans.length >= 2) {
    entry.timingConfidence = "high";
    return {
      success: true,
      entry,
      consensus: `${finishScans.length} volunteers — HIGH confidence (${(maxDiff / 1000).toFixed(1)}s spread)`,
    };
  }

  entry.timingConfidence = "medium";
  return { success: true, entry, consensus: `${finishScans.length} volunteers — medium confidence` };
}

// ── Disputes ──
export function getDisputes(): Dispute[] {
  return disputes;
}

export function createDispute(d: {
  bib: number;
  reason: string;
  evidence?: string[];
}): { success: boolean; dispute?: Dispute; error?: string } {
  const entries = getEntries();
  const entry = entries.find((e) => e.bib === d.bib);
  if (!entry) return { success: false, error: "Runner not found" };

  const existing = disputes.find((x) => x.bib === d.bib && x.status === "pending");
  if (existing) return { success: false, error: "A dispute is already pending for this bib" };

  const dispute: Dispute = {
    id: `DSP-${Date.now()}`,
    bib: d.bib,
    runnerName: `${entry.firstName} ${entry.lastName}`,
    reason: d.reason,
    submittedAt: Date.now(),
    status: "pending",
    originalTime: entry.finishTime && entry.startTime ? entry.finishTime - entry.startTime : undefined,
    evidence: d.evidence || [],
  };

  disputes.push(dispute);
  return { success: true, dispute };
}

export function resolveDispute(
  disputeId: string,
  action: "accepted" | "rejected",
  resolution: string,
  adjustedMs?: number
): { success: boolean; error?: string } {
  const dispute = disputes.find((d) => d.id === disputeId);
  if (!dispute) return { success: false, error: "Dispute not found" };
  if (dispute.status !== "pending") return { success: false, error: "Dispute already resolved" };

  dispute.status = action;
  dispute.resolution = resolution;
  dispute.resolvedAt = Date.now();

  if (action === "accepted" && adjustedMs !== undefined) {
    const entries = getEntries();
    const entry = entries.find((e) => e.bib === dispute.bib);
    if (entry && entry.startTime) {
      dispute.adjustedTime = adjustedMs;
      entry.finishTime = entry.startTime + adjustedMs;
    }
  }

  return { success: true };
}

// ── Formatting ──
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
