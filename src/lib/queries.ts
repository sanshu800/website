import "server-only";
import { all, count, one } from "./db";

/**
 * Read model for the operations dashboard.
 *
 * All aggregation lives here so pages stay presentational. Every number the
 * dashboard shows is derived from the same tables the seed script populates,
 * which means the UI cannot drift from the data.
 */

export type CompanyRow = {
  id: string;
  name: string;
  domain: string;
  sector: string;
  size: string;
  city: string;
  country: string;
  stage: string;
  health: string;
  arr: number;
  owner: string;
  website_intent: number;
  created_at: string;
  last_touch: string;
};

export type ContactRow = {
  id: string;
  company_id: string;
  name: string;
  title: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  seniority: string;
  status: string;
  created_at: string;
};

export type EngagementRow = {
  id: string;
  company_id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  owner: string;
  close_date: string;
  source: string;
  created_at: string;
};

export type TaskRow = {
  id: string;
  company_id: string | null;
  title: string;
  kind: string;
  priority: string;
  status: string;
  assignee: string;
  due_at: string;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  company_id: string | null;
  kind: string;
  summary: string;
  actor: string;
  source: string;
  at: string;
};

export type SubmissionRow = {
  id: string;
  kind: string;
  name: string | null;
  email: string | null;
  company: string | null;
  payload: string;
  created_at: string;
};

export type PipelineStage = { stage: string; deals: number; value: number };

const STAGE_ORDER = ["Discovery", "Qualified", "Proposal", "Negotiation", "Onboarding", "Won"];

export const dashboard = {
  totals() {
    return {
      companies: count(`SELECT COUNT(*) AS n FROM companies`),
      contacts: count(`SELECT COUNT(*) AS n FROM contacts`),
      engagements: count(`SELECT COUNT(*) AS n FROM engagements`),
      openTasks: count(`SELECT COUNT(*) AS n FROM tasks WHERE status != 'done'`),
      submissions: count(`SELECT COUNT(*) AS n FROM submissions`),
      pipeline: one<{ v: number }>(
        `SELECT COALESCE(SUM(value), 0) AS v FROM engagements WHERE stage NOT IN ('Won','Lost')`,
      )?.v ?? 0,
      wonValue: one<{ v: number }>(
        `SELECT COALESCE(SUM(value), 0) AS v FROM engagements WHERE stage = 'Won'`,
      )?.v ?? 0,
      atRisk: count(`SELECT COUNT(*) AS n FROM companies WHERE health IN ('risk','watch')`),
      unowned: count(`SELECT COUNT(*) AS n FROM companies WHERE owner = '' OR owner IS NULL`),
    };
  },

  pipeline(): PipelineStage[] {
    const rows = all<PipelineStage>(
      `SELECT stage, COUNT(*) AS deals, COALESCE(SUM(value), 0) AS value
         FROM engagements GROUP BY stage`,
    );
    return STAGE_ORDER.map(
      (stage) => rows.find((row) => row.stage === stage) ?? { stage, deals: 0, value: 0 },
    );
  },

  companies(options: {
    q?: string;
    sector?: string;
    health?: string;
    stage?: string;
    sort?: string;
    page?: number;
    perPage?: number;
  } = {}) {
    const { q, sector, health, stage, sort = "recent", page = 1, perPage = 12 } = options;
    const where: string[] = [];
    const params: unknown[] = [];

    if (q) {
      where.push(`(lower(name) LIKE ? OR lower(domain) LIKE ? OR lower(city) LIKE ?)`);
      const like = `%${q.toLowerCase()}%`;
      params.push(like, like, like);
    }
    if (sector && sector !== "All") {
      where.push(`sector = ?`);
      params.push(sector);
    }
    if (health && health !== "All") {
      where.push(`health = ?`);
      params.push(health);
    }
    if (stage && stage !== "All") {
      where.push(`stage = ?`);
      params.push(stage);
    }

    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const order =
      sort === "value"
        ? "ARR DESC"
        : sort === "name"
          ? "name ASC"
          : sort === "touch"
            ? "last_touch ASC"
            : "created_at DESC";

    const total = count(`SELECT COUNT(*) AS n FROM companies ${clause}`, params);
    const rows = all<CompanyRow>(
      `SELECT * FROM companies ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`,
      [...params, perPage, (page - 1) * perPage],
    );

    return {
      rows,
      total,
      page,
      perPage,
      pages: Math.max(1, Math.ceil(total / perPage)),
      sectors: all<{ sector: string; n: number }>(
        `SELECT sector, COUNT(*) AS n FROM companies GROUP BY sector ORDER BY n DESC`,
      ),
    };
  },

  company(id: string) {
    const company = one<CompanyRow>(`SELECT * FROM companies WHERE id = ?`, [id]);
    if (!company) return null;
    return {
      company,
      contacts: all<ContactRow>(
        `SELECT * FROM contacts WHERE company_id = ? ORDER BY seniority`,
        [id],
      ),
      engagements: all<EngagementRow>(
        `SELECT * FROM engagements WHERE company_id = ? ORDER BY value DESC`,
        [id],
      ),
      tasks: all<TaskRow>(
        `SELECT * FROM tasks WHERE company_id = ? ORDER BY due_at ASC`,
        [id],
      ),
      activities: all<ActivityRow>(
        `SELECT * FROM activities WHERE company_id = ? ORDER BY at DESC LIMIT 12`,
        [id],
      ),
    };
  },

  engagements() {
    return all<EngagementRow & { company: string }>(
      `SELECT e.*, c.name AS company FROM engagements e
         JOIN companies c ON c.id = e.company_id
        ORDER BY e.value DESC`,
    );
  },

  tasks(status?: string) {
    return all<TaskRow & { company: string | null }>(
      `SELECT t.*, c.name AS company FROM tasks t
         LEFT JOIN companies c ON c.id = t.company_id
        ${status && status !== "all" ? "WHERE t.status = ?" : ""}
        ORDER BY t.due_at ASC`,
      status && status !== "all" ? [status] : [],
    );
  },

  activities(limit = 14) {
    return all<ActivityRow & { company: string | null }>(
      `SELECT a.*, c.name AS company FROM activities a
         LEFT JOIN companies c ON c.id = a.company_id
        ORDER BY a.at DESC LIMIT ?`,
      [limit],
    );
  },

  /** Submission counts, computed in SQL so pages never call the clock. */
  submissionStats() {
    const cutoff = new Date(Date.now() - 86_400_000).toISOString();
    return {
      total: count(`SELECT COUNT(*) AS n FROM submissions`),
      recent: count(`SELECT COUNT(*) AS n FROM submissions WHERE created_at > ?`, [cutoff]),
      byKind: all<{ kind: string; n: number }>(
        `SELECT kind, COUNT(*) AS n FROM submissions GROUP BY kind`,
      ),
    };
  },

  submissions(kind?: string) {
    return all<SubmissionRow>(
      `SELECT * FROM submissions ${kind && kind !== "all" ? "WHERE kind = ?" : ""}
        ORDER BY created_at DESC LIMIT 50`,
      kind && kind !== "all" ? [kind] : [],
    );
  },

  contacts(limit = 40) {
    return all<ContactRow & { company: string }>(
      `SELECT ct.*, c.name AS company FROM contacts ct
         JOIN companies c ON c.id = ct.company_id
        ORDER BY ct.created_at DESC LIMIT ?`,
      [limit],
    );
  },

  sectors() {
    return all<{ sector: string; companies: number; value: number }>(
      `SELECT c.sector,
              COUNT(DISTINCT c.id) AS companies,
              COALESCE(SUM(e.value), 0) AS value
         FROM companies c
         LEFT JOIN engagements e ON e.company_id = c.id AND e.stage != 'Lost'
        GROUP BY c.sector ORDER BY value DESC`,
    );
  },

  /** Revenue by month for the dashboard chart, derived from close dates. */
  revenueByMonth() {
    return all<{ month: string; value: number }>(
      `SELECT substr(close_date, 1, 7) AS month,
              COALESCE(SUM(value), 0) AS value
         FROM engagements
        WHERE stage = 'Won'
        GROUP BY month ORDER BY month ASC`,
    );
  },
};
