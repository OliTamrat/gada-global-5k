import { Pool, types, type QueryResultRow } from "pg";

// int8 (bigint) arrives as a string by default. Every bigint in this schema is
// either an epoch-millisecond timestamp (~1.7e12) or a bigserial id, both well
// inside Number.MAX_SAFE_INTEGER, so parsing to a number is safe and keeps the
// shared TypeScript types free of string/number unions.
types.setTypeParser(types.builtins.INT8, (value) => Number(value));

function sslConfig(connectionString: string) {
  let hostname: string;
  let sslmode: string | null;
  try {
    const parsed = new URL(connectionString);
    hostname = parsed.hostname;
    sslmode = parsed.searchParams.get("sslmode");
  } catch {
    // An unparseable URL (often an unescaped character in the password) still
    // gets TLS — pg does its own parsing and will report the real problem.
    return { rejectUnauthorized: true };
  }

  if (sslmode === "disable") return undefined;
  if (!sslmode && (hostname === "localhost" || hostname === "127.0.0.1")) {
    return undefined;
  }
  // Managed Postgres (Neon, Vercel, Supabase) serves certificates from public
  // CAs, so verification stays on. `sslmode=no-verify` is the explicit opt-out
  // for self-signed certs.
  return { rejectUnauthorized: sslmode !== "no-verify" };
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and add your Postgres connection string."
    );
  }

  return new Pool({
    connectionString,
    ssl: sslConfig(connectionString),
    // Serverless functions get many short-lived instances, so each one keeps a
    // small pool and releases idle sockets quickly.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
}

// Reused across hot reloads in dev, which would otherwise leak a pool per edit.
const globalForDb = globalThis as unknown as { _gadaPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb._gadaPool) {
    globalForDb._gadaPool = createPool();
    globalForDb._gadaPool.on("error", (err) => {
      console.error("Postgres pool error:", err);
    });
  }
  return globalForDb._gadaPool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Runs `fn` inside a transaction, rolling back if it throws. */
export async function transaction<T>(
  fn: (client: import("pg").PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
