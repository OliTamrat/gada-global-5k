#!/usr/bin/env node
// Applies schema.sql to the database in DATABASE_URL.
// Safe to re-run: every statement is CREATE ... IF NOT EXISTS.
//
//   npm run db:setup

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const root = process.cwd();

// Load .env.local / .env for standalone runs (Next.js does this itself at runtime).
for (const file of [".env.local", ".env"]) {
  const full = path.join(root, file);
  if (!existsSync(full)) continue;
  const contents = await readFile(full, "utf-8");
  for (const line of contents.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    if (process.env[key] !== undefined) continue;
    process.env[key] = (match[2] ?? "").replace(/^(['"])([\s\S]*)\1$/, "$2").trim();
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Copy .env.example to .env.local and add your Postgres connection string."
  );
  process.exit(1);
}

const { hostname, searchParams } = new URL(connectionString);
const sslmode = searchParams.get("sslmode");
const ssl =
  sslmode === "disable" ||
  (!sslmode && (hostname === "localhost" || hostname === "127.0.0.1"))
    ? undefined
    : { rejectUnauthorized: sslmode !== "no-verify" };

const schema = await readFile(path.join(root, "schema.sql"), "utf-8");
const client = new pg.Client({ connectionString, ssl });

try {
  await client.connect();
  await client.query(schema);
  console.log(`Schema applied to ${hostname}`);
} catch (err) {
  console.error("Failed to apply schema:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
