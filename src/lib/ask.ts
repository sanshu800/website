import "server-only";
import { dashboard } from "./queries";
import { all } from "./db";
import { formatCurrency, formatDate, daysUntil, relativeTime } from "./utils";

/**
 * "Ask Reygent" — a deterministic answer engine over the firm's own records.
 *
 * Deliberately not a language model. It matches the question to one of a known
 * set of intents, runs the corresponding SQL, and returns the answer *with the
 * rows it came from*. That is the honest version of the product promise: an
 * answer you can audit. Swapping in a model later means generating the query
 * here, not replacing the citations.
 */

export type AskCitation = {
  label: string;
  detail: string;
  href: string;
};

export type AskAnswer = {
  intent: string;
  headline: string;
  detail: string;
  facts: { label: string; value: string }[];
  citations: AskCitation[];
  followUps: string[];
};

const SUGGESTIONS = [
  "What needs attention this week?",
  "How is the pipeline looking?",
  "Which clients have gone quiet?",
  "How are we doing by practice?",
  "What have we won this year?",
  "Where are the inbound leads coming from?",
];

export function askSuggestions(): string[] {
  return SUGGESTIONS;
}

export function answer(question: string): AskAnswer {
  const q = question.toLowerCase();

  if (matches(q, ["attention", "overdue", "late", "this week", "urgent", "behind"])) {
    return attentionAnswer();
  }
  if (matches(q, ["pipeline", "forecast", "deal", "engag", "opportunit"])) {
    return pipelineAnswer();
  }
  if (matches(q, ["quiet", "stale", "cold", "not touched", "no contact", "silent"])) {
    return staleAnswer();
  }
  if (matches(q, ["practice", "sector", "vertical", "industry", "breakdown"])) {
    return sectorsAnswer();
  }
  if (matches(q, ["won", "revenue", "closed", "booked", "income"])) {
    return wonAnswer();
  }
  if (matches(q, ["inbound", "lead", "submission", "form", "signup", "enquir", "inquir"])) {
    return inboundAnswer();
  }
  if (matches(q, ["client", "book", "account", "relationship", "how many"])) {
    return bookAnswer();
  }
  return overviewAnswer();
}

function matches(question: string, needles: string[]): boolean {
  return needles.some((needle) => question.includes(needle));
}

function attentionAnswer(): AskAnswer {
  const tasks = dashboard.tasks("open");
  const late = tasks.filter((task) => daysUntil(task.due_at) < 0);
  const risk = all<{ id: string; name: string; health: string; owner: string; last_touch: string }>(
    `SELECT id, name, health, owner, last_touch FROM companies WHERE health IN ('risk','watch') ORDER BY health DESC`,
  );

  return {
    intent: "attention",
    headline:
      late.length > 0
        ? `${late.length} task${late.length === 1 ? "" : "s"} past due, and ${risk.length} client relationship${risk.length === 1 ? "" : "s"} flagged.`
        : `Nothing overdue. ${risk.length} relationship${risk.length === 1 ? "" : "s"} still flagged for review.`,
    detail:
      "Overdue work comes from the task table where the due date has passed and the status is not done. Flagged relationships come from the health field the account owner sets.",
    facts: [
      { label: "Open tasks", value: String(tasks.length) },
      { label: "Overdue", value: String(late.length) },
      { label: "Flagged relationships", value: String(risk.length) },
    ],
    citations: [
      ...late.slice(0, 4).map((task) => ({
        label: task.title,
        detail: `${task.company ?? "No client"} · ${Math.abs(daysUntil(task.due_at))} days overdue · ${task.assignee || "no owner"}`,
        href: "/dashboard/tasks?status=open",
      })),
      ...risk.slice(0, 3).map((company) => ({
        label: company.name,
        detail: `${company.health} · owner ${company.owner || "unassigned"} · last touch ${formatDate(company.last_touch)}`,
        href: `/dashboard/companies/${company.id}`,
      })),
    ],
    followUps: ["Which clients have gone quiet?", "How is the pipeline looking?"],
  };
}

function pipelineAnswer(): AskAnswer {
  const stages = dashboard.pipeline();
  const totals = dashboard.totals();
  const open = stages.filter((stage) => stage.stage !== "Won");
  const weighted = all<{ v: number }>(
    `SELECT COALESCE(SUM(value * probability / 100.0), 0) AS v FROM engagements WHERE stage NOT IN ('Won','Lost')`,
  )[0]?.v ?? 0;

  return {
    intent: "pipeline",
    headline: `${formatCurrency(totals.pipeline)} open across ${stages.reduce((sum, stage) => sum + (stage.stage === "Won" ? 0 : stage.deals), 0)} engagements, ${formatCurrency(weighted)} weighted.`,
    detail:
      "Open value is the sum of engagement value where the stage is not Won or Lost. Weighted forecast multiplies each engagement by its recorded probability before summing.",
    facts: stages.map((stage) => ({
      label: stage.stage,
      value: `${formatCurrency(stage.value)} · ${stage.deals}`,
    })),
    citations: open
      .filter((stage) => stage.deals > 0)
      .map((stage) => ({
        label: stage.stage,
        detail: `${stage.deals} engagement${stage.deals === 1 ? "" : "s"} · ${formatCurrency(stage.value)}`,
        href: "/dashboard/engagements",
      })),
    followUps: ["What have we won this year?", "What needs attention this week?"],
  };
}

function staleAnswer(): AskAnswer {
  const rows = all<{ id: string; name: string; owner: string; last_touch: string; sector: string; stage: string }>(
    `SELECT id, name, owner, last_touch, sector, stage FROM companies ORDER BY last_touch ASC LIMIT 8`,
  );

  return {
    intent: "stale",
    headline: rows[0]
      ? `${rows[0].name} has not been touched since ${formatDate(rows[0].last_touch)}.`
      : "No client records yet.",
    detail:
      "Ordered by last recorded touch, ascending. Anything older than thirty days is normally a deliberate decision rather than an oversight — which is why it is worth asking.",
    facts: [
      { label: "Oldest touch", value: rows[0] ? relativeTime(rows[0].last_touch) : "—" },
      { label: "Records listed", value: String(rows.length) },
    ],
    citations: rows.map((row) => ({
      label: row.name,
      detail: `${row.sector} · ${row.stage} · owner ${row.owner || "unassigned"} · last touch ${formatDate(row.last_touch)}`,
      href: `/dashboard/companies/${row.id}`,
    })),
    followUps: ["What needs attention this week?", "How are we doing by practice?"],
  };
}

function sectorsAnswer(): AskAnswer {
  const rows = dashboard.sectors();
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return {
    intent: "sectors",
    headline: `${rows.length} practices, ${formatCurrency(total)} of value in total.`,
    detail:
      "Grouped by the practice recorded on the client company. Engagements marked Lost are excluded from the value column.",
    facts: rows.map((row) => ({
      label: row.sector,
      value: `${formatCurrency(row.value)} · ${row.companies} firm${row.companies === 1 ? "" : "s"}`,
    })),
    citations: rows.map((row) => ({
      label: row.sector,
      detail: `${row.companies} firms · ${total > 0 ? Math.round((row.value / total) * 100) : 0}% of value`,
      href: `/dashboard/companies?sector=${encodeURIComponent(row.sector)}`,
    })),
    followUps: ["Which clients have gone quiet?", "Where are the inbound leads coming from?"],
  };
}

function wonAnswer(): AskAnswer {
  const totals = dashboard.totals();
  const byMonth = dashboard.revenueByMonth();
  const biggest = all<{ company: string; title: string; value: number; close_date: string }>(
    `SELECT c.name AS company, e.title, e.value, e.close_date
       FROM engagements e JOIN companies c ON c.id = e.company_id
      WHERE e.stage = 'Won' ORDER BY e.value DESC LIMIT 5`,
  );

  return {
    intent: "won",
    headline: `${formatCurrency(totals.wonValue)} closed won across ${byMonth.length} month${byMonth.length === 1 ? "" : "s"}.`,
    detail:
      "Sums engagement value where the stage is Won, grouped by the month in the close date. The same query feeds the chart on the overview screen.",
    facts: byMonth.map((row) => ({ label: row.month, value: formatCurrency(row.value) })),
    citations: biggest.map((row) => ({
      label: row.company,
      detail: `${row.title} · ${formatCurrency(row.value)} · closed ${formatDate(row.close_date)}`,
      href: "/dashboard/engagements",
    })),
    followUps: ["How is the pipeline looking?", "How are we doing by practice?"],
  };
}

function inboundAnswer(): AskAnswer {
  const submissions = dashboard.submissions("all");
  const byKind = all<{ kind: string; n: number }>(
    `SELECT kind, COUNT(*) AS n FROM submissions GROUP BY kind ORDER BY n DESC`,
  );

  return {
    intent: "inbound",
    headline: `${submissions.length} inbound submission${submissions.length === 1 ? "" : "s"} recorded, across ${byKind.length} form${byKind.length === 1 ? "" : "s"}.`,
    detail:
      "Every public form on the marketing site writes to one table with a kind discriminator, so nothing is lost between the website and the platform.",
    facts: byKind.map((row) => ({ label: row.kind, value: String(row.n) })),
    citations: submissions.slice(0, 6).map((row) => ({
      label: row.name ?? row.email ?? "Anonymous",
      detail: `${row.kind} · ${row.company ?? "no firm given"} · ${relativeTime(row.created_at)}`,
      href: "/dashboard/submissions",
    })),
    followUps: ["What needs attention this week?", "How is the pipeline looking?"],
  };
}

function bookAnswer(): AskAnswer {
  const totals = dashboard.totals();
  const champions = all<{ n: number }>(
    `SELECT COUNT(*) AS n FROM contacts WHERE status = 'champion'`,
  )[0]?.n ?? 0;

  return {
    intent: "book",
    headline: `${totals.companies} client firms, ${totals.contacts} named contacts, ${formatCurrency(totals.pipeline + totals.wonValue)} of recorded value.`,
    detail:
      "Firms and contacts are counted directly. Value combines open pipeline with everything already won, which is why it is larger than the pipeline figure on the overview.",
    facts: [
      { label: "Client firms", value: String(totals.companies) },
      { label: "Contacts", value: String(totals.contacts) },
      { label: "Champions", value: String(champions) },
      { label: "Unowned records", value: String(totals.unowned) },
    ],
    citations: [
      { label: "Company records", detail: "Search and filter the full book", href: "/dashboard/companies" },
      { label: "Contact records", detail: "Everyone we have a name for", href: "/dashboard/contacts" },
    ],
    followUps: ["How are we doing by practice?", "Which clients have gone quiet?"],
  };
}

function overviewAnswer(): AskAnswer {
  const totals = dashboard.totals();
  const tasks = dashboard.tasks("open");
  const late = tasks.filter((task) => daysUntil(task.due_at) < 0).length;

  return {
    intent: "overview",
    headline: `${formatCurrency(totals.pipeline)} in open pipeline across ${totals.companies} firms, ${tasks.length} open task${tasks.length === 1 ? "" : "s"}${late > 0 ? `, ${late} overdue` : ""}.`,
    detail:
      "I could not match that question to a specific query, so this is the workspace summary. The questions below are the ones I can answer with a citation.",
    facts: [
      { label: "Open pipeline", value: formatCurrency(totals.pipeline) },
      { label: "Won to date", value: formatCurrency(totals.wonValue) },
      { label: "Client firms", value: String(totals.companies) },
      { label: "At risk", value: String(totals.atRisk) },
    ],
    citations: [
      { label: "Overview screen", detail: "Everything above, with charts", href: "/dashboard" },
      { label: "Inbound submissions", detail: `${totals.submissions} captured from the website`, href: "/dashboard/submissions" },
    ],
    followUps: SUGGESTIONS.slice(0, 3),
  };
}
