/* eslint-disable no-console */
/**
 * Database concurrency check — `npm run db:check`.
 *
 * Reproduces the two shapes a deploy runs into, in the order a deploy meets
 * them:
 *
 *   1. **Cold start** — several build workers open a database that does not
 *      exist yet, all racing to create it.
 *   2. **Contention** — workers open a database that already exists while
 *      something else (a running server, a seed) holds a write.
 *
 * Both failures come from work that used to happen on every connection:
 * `PRAGMA journal_mode = WAL`, which needs an exclusive lock that SQLite will
 * not let `busy_timeout` cover, and the full schema, executed unconditionally
 * instead of behind `PRAGMA user_version`. With no `busy_timeout` set either,
 * the losing process failed instantly with `database is locked`.
 *
 * **Synchronisation matters more than the scenario.** An earlier version of
 * this file released the workers on a timer, and it reported a pass against the
 * original buggy code — the workers were still booting when the holder
 * committed, so there was no contention to lose. Worker processes here import
 * their code first, then block on a file until the parent says go, and the
 * parent only says go once the holder has confirmed the write is locked. That
 * way the overlap is guaranteed instead of hoped for, and Node's startup time
 * is not part of the measurement.
 *
 * Measured against the original code, three runs out of three: the cold start
 * loses 5 of 6 workers, each with `database is locked`, and the check exits 1.
 * Against the current code all 6 open cleanly in both phases, three runs out of
 * three. Treat a pass as evidence, not as proof — and note which phase carries
 * the weight. Contention against an *already initialised* database passes even
 * with the original code, because setting the journal mode to the value it
 * already has is a no-op and `CREATE TABLE IF NOT EXISTS` does not need to
 * write. The failure needs a database that is not yet in WAL mode, which is why
 * it showed up on deploy: a host without a persistent data directory rebuilds
 * the database on every release, so every deploy is a cold start.
 *
 * Runs against a throwaway database in the system temp directory unless
 * `REYGENT_DB_PATH` is set, and writes nothing outside it.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROLE = process.argv[2];
const WORKERS = 6;
const DB = process.env.REYGENT_DB_PATH ?? "";
const GO = process.env.REYGENT_DBCHECK_GO ?? "";

/** Waits for the parent to release the barrier, so every worker starts together. */
function waitForGo(): Promise<void> {
  if (!GO) return Promise.resolve();
  return new Promise((resolve) => {
    const poll = setInterval(() => {
      if (existsSync(GO)) {
        clearInterval(poll);
        resolve();
      }
    }, 10);
  });
}

/** One worker: import first (slow), then block on the barrier, then open the database. */
async function worker(label: string): Promise<void> {
  const { getDb } = await import("../src/lib/db.ts");
  await waitForGo();
  const started = Date.now();
  try {
    const db = getDb();
    db.prepare("SELECT COUNT(*) AS n FROM events").get();
    db.prepare("SELECT COUNT(*) AS n FROM content_overrides").get();
    console.log(`worker ${label}: ok ${Date.now() - started}ms`);
  } catch (error) {
    console.log(`worker ${label}: FAILED ${(error as Error).message}`);
  }
}

/** The holder: a write transaction held open, as a busy server would have it. */
async function holder(): Promise<void> {
  const { getDb } = await import("../src/lib/db.ts");
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  db.prepare("INSERT INTO events (id, name, created_at) VALUES (?, ?, ?)").run(
    "lockcheck",
    "page_view",
    new Date().toISOString(),
  );
  console.log("holding");
  await new Promise((resolve) => setTimeout(resolve, 8000));
  db.exec("COMMIT");
  console.log("holder: committed");
}

/** Runs one role in a child process and collects everything it prints. */
function makeRunner(env: NodeJS.ProcessEnv, self: string) {
  return (args: string[], onOutput?: (chunk: string) => void) =>
    new Promise<string>((resolve) => {
      const child = spawn(process.execPath, ["--experimental-strip-types", self, ...args], {
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let out = "";
      child.stdout.on("data", (chunk: string) => {
        out += chunk;
        onOutput?.(String(chunk));
      });
      child.on("close", () => resolve(out));
    });
}

async function main(): Promise<void> {
  if (ROLE === "worker") return worker(String(process.argv[3] ?? "?"));
  if (ROLE === "holder") return holder();

  /*
   * The barrier file always goes in its own temp directory, never beside the
   * database: `REYGENT_DB_PATH` points at the real one, and a check has no
   * business leaving files there.
   */
  const scratch = mkdtempSync(path.join(tmpdir(), "reygent-dbcheck-"));
  const dir = DB ? "" : scratch;
  const dbPath = DB || path.join(scratch, "check.db");
  const goPath = path.join(scratch, "go");
  const self = process.argv[1];
  if (!self) {
    console.error("Could not determine this script's path from argv.");
    process.exit(1);
  }

  const env = { ...process.env, REYGENT_DB_PATH: dbPath, REYGENT_DBCHECK_GO: goPath };
  const run = makeRunner(env, self);
  const failures: string[] = [];

  const report = (label: string, outputs: string[]) => {
    const lines = outputs.flatMap((out) => out.split("\n"));
    const failed = lines.filter((line) => line.includes("FAILED"));
    failures.push(...failed.map((line) => `${label}: ${line.trim()}`));
    // A silent worker is also a failure — it means the role never got to run.
    const ok = lines.filter((line) => line.includes(": ok")).length;
    console.log(
      `  ${label}: ${ok}/${WORKERS} opened cleanly` + (failed.length ? `, ${failed.length} failed` : ""),
    );
  };

  console.log(`Racing ${WORKERS} workers against ${DB ? dbPath : "a fresh database"}.\n`);

  // Phase 1 — cold start: no database on disk, everyone creates it at once.
  console.log("1. Cold start (no database exists yet)");
  const cold = Array.from({ length: WORKERS }, (_, i) => run(["worker", `c${i + 1}`]));
  await new Promise((resolve) => setTimeout(resolve, 1500)); // let every worker import its code
  writeFileSync(goPath, ""); // release the barrier: the race starts here
  report("cold start", await Promise.all(cold));

  // Phase 2 — contention: an existing database with a write held open.
  console.log("\n2. Contention (a write is held open while workers connect)");
  rmSync(goPath, { force: true });
  const workers = Array.from({ length: WORKERS }, (_, i) => run(["worker", `h${i + 1}`]));
  let releaseHolder: Promise<string> = Promise.resolve("");
  const holding = new Promise<void>((resolve) => {
    releaseHolder = run(["holder"], (chunk) => {
      if (chunk.includes("holding")) resolve();
    });
  });
  await holding; // the lock is definitely held now
  await new Promise((resolve) => setTimeout(resolve, 1500));
  writeFileSync(goPath, ""); // release the workers into the contention
  report("contention", await Promise.all(workers));
  await releaseHolder;

  if (dir) rmSync(dir, { recursive: true, force: true });

  if (failures.length > 0) {
    console.error(`\n✗ ${failures.length} connection(s) could not open the database:`);
    for (const line of failures) console.error(`    ${line}`);
    console.error(
      "\n  This is the `database is locked` failure that breaks a deploy. It means a\n" +
        "  connection is doing schema work (or changing the journal mode) while another\n" +
        "  process holds a write, and that SQLite is not being allowed to wait for it.\n" +
        "  See the lock notes at the top of src/lib/db.ts.\n",
    );
    process.exit(1);
  }

  console.log(
    "\n✓ Every connection opened cleanly, both on a cold start and while a write\n" +
      "  transaction was held open.",
  );
}

void main();
