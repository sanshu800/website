/* eslint-disable no-console */
/**
 * Seeds the local SQLite database with a realistic operations dataset.
 *
 *   npm run seed          # create data/reygent.db and populate it
 *   npm run db:reset      # wipe and re-seed
 *
 * Idempotent: re-running without --reset does nothing if data already exists.
 * Run this before opening /dashboard or logging in.
 */
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.REYGENT_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.REYGENT_DB_PATH ?? path.join(DATA_DIR, "reygent.db");
const reset = process.argv.includes("--reset");

if (reset) {
  for (const suffix of ["", "-wal", "-shm"]) {
    try {
      rmSync(`${DB_PATH}${suffix}`);
    } catch {
      /* not present */
    }
  }
}

mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);

db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner', org_name TEXT NOT NULL DEFAULT 'Reygent',
  password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
  user_agent TEXT);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT NOT NULL, sector TEXT NOT NULL,
  size TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, stage TEXT NOT NULL,
  health TEXT NOT NULL, arr INTEGER NOT NULL DEFAULT 0, owner TEXT NOT NULL,
  website_intent INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, last_touch TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL, title TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, linkedin TEXT,
  seniority TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE TABLE IF NOT EXISTS engagements (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL, value INTEGER NOT NULL, stage TEXT NOT NULL, probability INTEGER NOT NULL,
  owner TEXT NOT NULL, close_date TEXT NOT NULL, source TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_engagements_company ON engagements(company_id);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL, kind TEXT NOT NULL, priority TEXT NOT NULL, status TEXT NOT NULL,
  assignee TEXT NOT NULL, due_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, summary TEXT NOT NULL, actor TEXT NOT NULL, source TEXT NOT NULL, at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_activities_company ON activities(company_id);
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL, name TEXT, email TEXT, company TEXT,
  payload TEXT NOT NULL, created_at TEXT NOT NULL);
`);

const existing = db.prepare(`SELECT COUNT(*) AS n FROM companies`).get() as { n: number };
if (existing.n > 0 && !reset) {
  console.log(`Database already seeded (${existing.n} companies). Use npm run db:reset to rebuild.`);
  process.exit(0);
}

/* ---------------- helpers ---------------- */
const now = Date.now();
const iso = (daysFromNow: number) => new Date(now + daysFromNow * 86_400_000).toISOString();
const pick = <T,>(list: readonly T[], seed: number): T => list[seed % list.length]!;

const FIRMS = [
  { name: "Halloran & Vance", sector: "Legal", size: "16-40", city: "Boston", country: "United States", stage: "Onboarding", health: "healthy", arr: 42000, owner: "N. Okafor" },
  { name: "Marlowe Advisory", sector: "Advisory", size: "6-15", city: "London", country: "United Kingdom", stage: "Negotiation", health: "risk", arr: 28500, owner: "P. Raghavan" },
  { name: "Brightwell", sector: "Accounting", size: "41-100", city: "Manchester", country: "United Kingdom", stage: "Won", health: "healthy", arr: 96000, owner: "P. Raghavan" },
  { name: "Kessler Partners", sector: "Legal", size: "16-40", city: "Chicago", country: "United States", stage: "Qualified", health: "watch", arr: 34000, owner: "D. Kessler" },
  { name: "Northgate Consulting", sector: "Consulting", size: "41-100", city: "Toronto", country: "Canada", stage: "Proposal", health: "watch", arr: 78000, owner: "M. Okonjo" },
  { name: "Pell & Rowe", sector: "Accounting", size: "6-15", city: "Bristol", country: "United Kingdom", stage: "Won", health: "healthy", arr: 24500, owner: "M. Pell" },
  { name: "Ashford Legal", sector: "Legal", size: "6-15", city: "Austin", country: "United States", stage: "Discovery", health: "healthy", arr: 0, owner: "N. Okafor" },
  { name: "Verity Advisors", sector: "Advisory", size: "6-15", city: "Amsterdam", country: "Netherlands", stage: "Onboarding", health: "healthy", arr: 31000, owner: "T. Verity" },
  { name: "Lumen Tax Group", sector: "Accounting", size: "16-40", city: "Dublin", country: "Ireland", stage: "Qualified", health: "healthy", arr: 27000, owner: "P. Raghavan" },
  { name: "Sterling Hoyt", sector: "Legal", size: "41-100", city: "New York", country: "United States", stage: "Negotiation", health: "risk", arr: 112000, owner: "E. Sterling" },
  { name: "Oakhill Consulting", sector: "Consulting", size: "16-40", city: "Copenhagen", country: "Denmark", stage: "Proposal", health: "healthy", arr: 58000, owner: "M. Okonjo" },
  { name: "Ferrand & Co", sector: "Advisory", size: "1-5", city: "Lyon", country: "France", stage: "Discovery", health: "healthy", arr: 0, owner: "F. Ferrand" },
  { name: "Whitcombe Legal", sector: "Legal", size: "16-40", city: "Leeds", country: "United Kingdom", stage: "Won", health: "healthy", arr: 39000, owner: "N. Okafor" },
  { name: "Barnaby Partners", sector: "Accounting", size: "41-100", city: "Birmingham", country: "United Kingdom", stage: "Qualified", health: "watch", arr: 64000, owner: "D. Kessler" },
  { name: "Solvay Advisory", sector: "Advisory", size: "6-15", city: "Brussels", country: "Belgium", stage: "Proposal", health: "healthy", arr: 29500, owner: "T. Verity" },
  { name: "Harrow & Finch", sector: "Legal", size: "41-100", city: "Melbourne", country: "Australia", stage: "Negotiation", health: "healthy", arr: 87500, owner: "E. Sterling" },
  { name: "Clifford Nash", sector: "Consulting", size: "16-40", city: "Singapore", country: "Singapore", stage: "Onboarding", health: "healthy", arr: 52000, owner: "M. Okonjo" },
  { name: "Dunmore Tax", sector: "Accounting", size: "6-15", city: "Edinburgh", country: "United Kingdom", stage: "Discovery", health: "healthy", arr: 0, owner: "P. Raghavan" },
  { name: "Alder & Pike", sector: "Legal", size: "16-40", city: "Denver", country: "United States", stage: "Won", health: "healthy", arr: 44500, owner: "D. Kessler" },
  { name: "Ravensworth", sector: "Advisory", size: "16-40", city: "Zurich", country: "Switzerland", stage: "Qualified", health: "healthy", arr: 61000, owner: "T. Verity" },
  { name: "Highgate Consulting", sector: "Consulting", size: "6-15", city: "Berlin", country: "Germany", stage: "Proposal", health: "watch", arr: 33500, owner: "M. Okonjo" },
  { name: "Marchmont Legal", sector: "Legal", size: "1-5", city: "Glasgow", country: "United Kingdom", stage: "Discovery", health: "watch", arr: 0, owner: "" },
  { name: "Tavistock Accounting", sector: "Accounting", size: "16-40", city: "Cardiff", country: "United Kingdom", stage: "Onboarding", health: "healthy", arr: 36800, owner: "P. Raghavan" },
  { name: "Bellweather Advisory", sector: "Advisory", size: "41-100", city: "San Francisco", country: "United States", stage: "Won", health: "healthy", arr: 128000, owner: "E. Sterling" },
];

const FIRST = ["Marguerite", "Daniel", "Priya", "Tomas", "Eleanor", "Marcus", "Nadia", "Felix", "Claire", "Rupert", "Imogen", "Hugo", "Beatrice", "Callum", "Yasmin", "Oscar", "Lydia", "Ravi", "Sofia", "Julian"];
const LAST = ["Halloran", "Kessler", "Raghavan", "Verity", "Sterling", "Pell", "Okafor", "Ferrand", "Whitcombe", "Barnaby", "Solvay", "Nash", "Dunmore", "Ravensworth", "Highgate", "Marchmont"];
const SENIORITY = ["decision-maker", "champion", "influencer", "user"];
const TITLES = ["Managing Partner", "Operations Director", "Practice Manager", "Chief Operating Officer", "Partner", "Head of Finance", "Head of Client Services", "Senior Associate"];

/* ---------------- users ---------------- */
function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

const users = [
  { email: "demo@reygent.ai", name: "Alex Morgan", role: "owner", org: "Reygent" },
  { email: "ops@reygent.ai", name: "Jordan Lee", role: "admin", org: "Reygent" },
];
for (const user of users) {
  db.prepare(
    `INSERT OR REPLACE INTO users (id, email, name, role, org_name, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(`usr_${user.role}`, user.email, user.name, user.role, user.org, hashPassword("demo1234"), iso(-120));
}

/* ---------------- companies, contacts, engagements ---------------- */
const sources = ["Referral", "Website enquiry", "Existing client", "Conference", "Outbound"];

FIRMS.forEach((firm, index) => {
  const companyId = `cmp_${String(index + 1).padStart(3, "0")}`;
  db.prepare(
    `INSERT OR REPLACE INTO companies
     (id, name, domain, sector, size, city, country, stage, health, arr, owner, website_intent, created_at, last_touch)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    companyId,
    firm.name,
    `${firm.name.toLowerCase().replace(/[^a-z]+/g, "")}.example`,
    firm.sector,
    firm.size,
    firm.city,
    firm.country,
    firm.stage,
    firm.health,
    firm.arr,
    firm.owner,
    (index * 7) % 100,
    iso(-90 + index * 3),
    iso(-Math.max(1, 45 - index * 2)),
  );

  const contactCount = firm.size === "41-100" ? 4 : firm.size === "16-40" ? 3 : 2;
  for (let c = 0; c < contactCount; c += 1) {
    const first = pick(FIRST, index * 3 + c * 5);
    const last = pick(LAST, index * 2 + c);
    db.prepare(
      `INSERT OR REPLACE INTO contacts
       (id, company_id, name, title, email, phone, linkedin, seniority, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      `ctc_${index}_${c}`,
      companyId,
      `${first} ${last}`,
      pick(TITLES, index + c * 2),
      `${first.toLowerCase()}.${last.toLowerCase()}@${firm.name.toLowerCase().replace(/[^a-z]+/g, "")}.example`,
      c === 0 ? `+1 415 555 0${(100 + index).toString().slice(0, 3)}` : null,
      `linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
      SENIORITY[Math.min(c, SENIORITY.length - 1)]!,
      c === 0 ? "decision-maker" : "engaged",
      iso(-90 + index * 3),
    );
  }

  if (firm.arr > 0) {
    db.prepare(
      `INSERT OR REPLACE INTO engagements
       (id, company_id, title, value, stage, probability, owner, close_date, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      `eng_${index}_0`,
      companyId,
      `${firm.sector.toLowerCase()} platform — ${firm.name}`,
      firm.arr,
      firm.stage === "Won" ? "Won" : firm.stage,
      firm.stage === "Won" ? 100 : 45 + ((index * 13) % 45),
      firm.owner || "Unassigned",
      iso(firm.stage === "Won" ? -(index % 8) - 1 : 12 + (index % 60)),
      pick(sources, index),
      iso(-80 + index * 2),
    );
  }
});

/* ---------------- tasks ---------------- */
const TASK_TEMPLATES = [
  { title: "Validate director documents", kind: "Document", priority: "high" },
  { title: "Chase outstanding ledger access", kind: "Document", priority: "high" },
  { title: "Send revised fee schedule", kind: "Follow-up", priority: "high" },
  { title: "Confirm kickoff call attendance", kind: "Scheduling", priority: "medium" },
  { title: "Review onboarding checklist", kind: "Delivery", priority: "medium" },
  { title: "Escalate stalled sequence", kind: "Follow-up", priority: "high" },
  { title: "Prepare quarterly review pack", kind: "Reporting", priority: "medium" },
  { title: "Confirm scope change request", kind: "Delivery", priority: "medium" },
  { title: "Introduce delivery team", kind: "Delivery", priority: "low" },
  { title: "Update matter status", kind: "Delivery", priority: "low" },
];
TASK_TEMPLATES.forEach((template, index) => {
  const companyIndex = (index * 2) % FIRMS.length;
  db.prepare(
    `INSERT OR REPLACE INTO tasks
     (id, company_id, title, kind, priority, status, assignee, due_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    `tsk_${index}`,
    `cmp_${String(companyIndex + 1).padStart(3, "0")}`,
    template.title,
    template.kind,
    template.priority,
    index % 4 === 0 ? "done" : index % 5 === 0 ? "blocked" : "open",
    pick(["N. Okafor", "P. Raghavan", "M. Okonjo", "T. Verity"], index),
    iso(index % 6 === 0 ? -2 : (index % 12) + 1),
    iso(-14 + index),
  );
});

db.prepare(
  `INSERT OR REPLACE INTO tasks (id, company_id, title, kind, priority, status, assignee, due_at, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
).run("tsk_orphan", null, "Review intake qualification criteria", "Operations", "high", "open", "A. Morgan", iso(3), iso(-1));

/* ---------------- activities ---------------- */
const ACTIVITY_TEMPLATES = [
  { kind: "email", summary: "Proposal sent with fee schedule attached", source: "Outlook" },
  { kind: "call", summary: "Discovery call — 42 minutes, next step agreed", source: "Zoom" },
  { kind: "document", summary: "Engagement letter signed and filed", source: "DocuSign" },
  { kind: "note", summary: "Partner flagged fee sensitivity for the next review", source: "Reygent" },
  { kind: "meeting", summary: "Kickoff held; delivery team introduced", source: "Calendar" },
  { kind: "alert", summary: "Sequence stalled after third touch — escalated", source: "Reygent" },
  { kind: "email", summary: "Document chase sent (2 of 3)", source: "Outlook" },
  { kind: "note", summary: "Budget burn reviewed against delivery progress", source: "Reygent" },
];
for (let i = 0; i < 60; i += 1) {
  const template = pick(ACTIVITY_TEMPLATES, i);
  const companyIndex = (i * 5) % FIRMS.length;
  db.prepare(
    `INSERT OR REPLACE INTO activities (id, company_id, kind, summary, actor, source, at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    `act_${i}`,
    `cmp_${String(companyIndex + 1).padStart(3, "0")}`,
    template.kind,
    template.summary,
    pick(["A. Morgan", "N. Okafor", "P. Raghavan", "M. Okonjo", "T. Verity"], i * 2),
    template.source,
    iso(-(i % 30)),
  );
}

/* ---------------- inbound submissions ---------------- */
const SUBMISSIONS = [
  { kind: "demo", name: "Imogen Clarke", email: "imogen.clarke@harrowfinch.example", company: "Harrow & Finch", payload: { message: "We run intake across three offices and it is chaos. Want to see how you handle routing.", sector: "Legal", size: "41-100" } },
  { kind: "contact", name: "Rupert Dunmore", email: "rupert@dunmoretax.example", company: "Dunmore Tax", payload: { message: "Seasonal peak is killing us. Interested in the document collection piece specifically.", sector: "Accounting", size: "6-15" } },
  { kind: "demo", name: "Claire Solvay", email: "claire@solvay.example", company: "Solvay Advisory", payload: { message: "Currently on a CRM nobody updates. Need something my advisers will actually use.", sector: "Advisory", size: "6-15" } },
  { kind: "newsletter", name: "Ravi Ravindran", email: "ravi@lumentax.example", company: "Lumen Tax Group", payload: { source: "footer" } },
  { kind: "get-started", name: "Beatrice Marchmont", email: "b@marchmontlegal.example", company: "Marchmont Legal", payload: { plan: "Core", seats: 4 } },
  { kind: "contact", name: "Oscar Bellweather", email: "oscar@bellweather.example", company: "Bellweather Advisory", payload: { message: "Evaluating three platforms. What does implementation actually cost us in internal hours?", sector: "Advisory", size: "41-100" } },
];
SUBMISSIONS.forEach((submission, index) => {
  db.prepare(
    `INSERT OR REPLACE INTO submissions (id, kind, name, email, company, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    `sub_${index}`,
    submission.kind,
    submission.name,
    submission.email,
    submission.company,
    JSON.stringify(submission.payload),
    iso(-index * 2 - 1),
  );
});

const totals = db.prepare(
  `SELECT
     (SELECT COUNT(*) FROM companies) AS companies,
     (SELECT COUNT(*) FROM contacts) AS contacts,
     (SELECT COUNT(*) FROM engagements) AS engagements,
     (SELECT COUNT(*) FROM tasks) AS tasks,
     (SELECT COUNT(*) FROM activities) AS activities,
     (SELECT COUNT(*) FROM submissions) AS submissions`,
).get() as Record<string, number>;

console.log(`Seeded ${DB_PATH}`);
console.log(
  `  ${totals.companies} companies · ${totals.contacts} contacts · ${totals.engagements} engagements · ${totals.tasks} tasks · ${totals.activities} activities · ${totals.submissions} submissions`,
);
console.log(`\nDemo login:  demo@reygent.ai  /  demo1234`);
console.log(`Admin login: ops@reygent.ai   /  demo1234`);
