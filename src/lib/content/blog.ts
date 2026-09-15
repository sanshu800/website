/**
 * Editorial content.
 *
 * Posts are stored as structured blocks so the index, article template, related
 * reading and RSS all read from one source. Writing bodies as data keeps the
 * article page a pure renderer.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; title: string; text: string };

export type Post = {
  slug: string;
  title: string;
  /** Meta description + index card copy. */
  excerpt: string;
  category: "Operations" | "Intake" | "Follow-up" | "Reporting" | "AI" | "Growth";
  author: { name: string; role: string };
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  body: Block[];
};

const AUTHORS = {
  maya: { name: "Maya Okonjo", role: "Head of Operations Research" },
  dev: { name: "Dev Sharma", role: "Founder" },
  lena: { name: "Lena Fischer", role: "Principal, Firm Practice" },
  ash: { name: "Ash Mottram", role: "Platform Lead" },
} as const;

export const posts: Post[] = [
  {
    slug: "operations-audit-for-professional-services",
    title: "The 90-minute operations audit any firm can run this week",
    excerpt:
      "Before you buy software or hire anyone, measure the gaps. This is the audit we run in the first week of every engagement, with the questions and the benchmarks.",
    category: "Operations",
    author: AUTHORS.maya,
    publishedAt: "2026-08-19",
    readingMinutes: 9,
    featured: true,
    body: [
      { type: "p", text: "Most firms that approach us already know something is wrong. They cannot say what it costs. That is the gap this audit closes: ninety minutes, four measurements, and a number you can put in front of a partner meeting." },
      { type: "h2", text: "Measurement one: time to first reply" },
      { type: "p", text: "Pick the last twenty enquiries your firm received. For each, record when it arrived and when a human replied with anything substantive. Not an acknowledgement — a reply that moved the matter forward. Then take the median. Firms who believe they answer within an hour usually discover the median is between six and twenty-two hours." },
      { type: "callout", title: "Why the median and not the average", text: "One enquiry answered in three minutes and one answered next Tuesday average to something flattering and useless. The median describes the experience your typical prospect actually has." },
      { type: "h2", text: "Measurement two: touches before a decision" },
      { type: "p", text: "Count the distinct interactions between your firm and a prospect before they either engage or go quiet. Then count how many of those were initiated by you. In most firms the prospect initiates the majority, which means the follow-through is theirs, not yours." },
      { type: "h2", text: "Measurement three: the chase ratio" },
      { type: "p", text: "Take last month's client correspondence and count what proportion was chasing something — a document, an approval, a signature, a decision. If more than a third of client correspondence is chasing, you have found the repetitive layer, and it is large." },
      { type: "ul", items: [
        "Documents outstanding per client, and how long each has been outstanding",
        "How many were chased more than twice",
        "How many were chased by more than one person, unaware of each other",
      ] },
      { type: "h2", text: "Measurement four: report assembly time" },
      { type: "p", text: "Time how long it takes to produce your most frequent report, from opening the first export to sending it. Multiply by the number of times you produce it in a year. This is the number that usually ends the debate, because it is unambiguous and it is paid in senior hours." },
      { type: "h2", text: "What to do with the four numbers" },
      { type: "ol", items: [
        "Publish them internally. The first effect of measurement is that the gap stops being a matter of opinion.",
        "Rank them by cost, not by how annoying they are. The loudest problem is rarely the most expensive.",
        "Fix one, completely, before starting the second. Half-automated processes create new seams.",
        "Re-measure in ninety days. If the number has not moved, the change was theatre.",
      ] },
      { type: "quote", text: "We thought the problem was lead generation. The audit showed we were generating plenty and losing a third of it to slow first replies.", attribution: "Managing Partner, mid-size legal firm" },
      { type: "p", text: "You do not need software to run this audit. You need ninety minutes and a willingness to look at the median rather than the best case. Firms that do it usually find the same thing: the work is not the problem, the gaps between the work are." },
    ],
  },
  {
    slug: "intake-is-a-revenue-function",
    title: "Intake is a revenue function. Staff it like one.",
    excerpt:
      "The first hour of a client relationship determines whether there is a relationship. Most firms treat that hour as administration.",
    category: "Intake",
    author: AUTHORS.dev,
    publishedAt: "2026-08-05",
    readingMinutes: 6,
    featured: true,
    body: [
      { type: "p", text: "Ask a partner what wins work and you will hear: relationships, reputation, responsiveness. Two of those three are things you can build systems around. Only one of them is luck." },
      { type: "h2", text: "The responsiveness premium" },
      { type: "p", text: "A prospect contacting three firms has no strong preference yet. The firm that replies first sets the frame for the conversation: they are the ones who are organised, who have capacity, who took it seriously. The standard is not 'fast for a professional firm'. It is 'fast'." },
      { type: "h2", text: "Why intake gets staffed badly" },
      { type: "ul", items: [
        "It is nobody's named responsibility, so it belongs to whoever is nearest the inbox",
        "The people best able to qualify are the most expensive to interrupt",
        "There is no queue, so there is no visibility, so there is no accountability",
        "Success is unmeasured, so it cannot be managed or improved",
      ] },
      { type: "h2", text: "Three changes that matter more than a new hire" },
      { type: "ol", items: [
        "One front door. Every channel creates the same record, so nothing can hide in a personal inbox.",
        "A dated next step on every enquiry. A record cannot rest without an owner and a date — this single constraint removes most silent loss.",
        "Response-time reporting per source. Once the number is visible weekly, it improves without a project.",
      ] },
      { type: "callout", title: "The uncomfortable version", text: "If you cannot state your median time to first reply, you do not currently know whether intake is working. That is the real finding." },
      { type: "p", text: "None of this requires a new department. It requires treating the first hour as part of the service you sell, and instrumenting it accordingly." },
    ],
  },
  {
    slug: "follow-up-cadence-that-does-not-annoy",
    title: "A follow-up cadence that does not read as pestering",
    excerpt:
      "Persistence and pressure look identical from the outside if the content is empty. The difference is whether each touch carries something.",
    category: "Follow-up",
    author: AUTHORS.lena,
    publishedAt: "2026-07-22",
    readingMinutes: 7,
    body: [
      { type: "p", text: "Most firms have one of two follow-up cultures: relentless chasing that damages the relationship, or genteel silence that loses the work. The middle path is not a matter of tone. It is a matter of carrying information." },
      { type: "h2", text: "The rule: every touch must add something" },
      { type: "p", text: "A follow-up earns its place if it carries a new fact, a clarification, a relevant example, a deadline, or a direct question that is genuinely easier to answer than to ignore. 'Just checking in' carries nothing and reads as pressure." },
      { type: "h2", text: "A cadence shape that works" },
      { type: "ol", items: [
        "Same day: the substantive reply, with the next step named.",
        "Day three: something useful — a relevant precedent, a document, an answer to an unasked question.",
        "Day eight: a specific question. One question, answerable in a line.",
        "Day sixteen: a decision point. Is this moving, parked, or closed? Offer the exit.",
        "Thereafter: quarterly, unless they ask you to stop.",
      ] },
      { type: "callout", title: "Give people a dignified exit", text: "Every cadence should include an easy way to say 'not now'. Prospects who take it are not lost; they are being honest, which is more useful than silence." },
      { type: "h2", text: "Why memory fails and rules do not" },
      { type: "p", text: "The reason cadences collapse is not that people are careless. It is that the fourth touch lands in a week when three deadlines collide. A rule that fires independently of the week's chaos is the only version of persistence that survives contact with a busy practice." },
    ],
  },
  {
    slug: "month-end-reporting-without-the-scramble",
    title: "Rebuilding the month-end report is a design failure, not a workload problem",
    excerpt:
      "If your reporting requires reconstruction, the operating data was never designed to be reported on. Here is the fix, in order.",
    category: "Reporting",
    author: AUTHORS.maya,
    publishedAt: "2026-07-08",
    readingMinutes: 8,
    body: [
      { type: "p", text: "There is a particular kind of exhaustion that comes from producing a number you have produced eleven times before. It is not difficult work. It is work that should not exist." },
      { type: "h2", text: "Three symptoms of reconstruction" },
      { type: "ul", items: [
        "The report requires an export, a cleanup and a manual join",
        "Two people produce different versions of the same metric",
        "The definition of a metric changes depending on who is asked",
      ] },
      { type: "h2", text: "Fix the definition before the pipeline" },
      { type: "p", text: "Most reporting projects start with a dashboard and fail because the metric was never agreed. Write down, in one sentence each, what the number means and what it excludes. 'Utilisation: billable hours divided by available hours, excluding approved leave and internal training.' If two teams disagree on that sentence, no tooling will reconcile them." },
      { type: "h2", text: "Then fix the capture" },
      { type: "ol", items: [
        "Record the event where it happens, not in a reconstruction later.",
        "Attach the client and engagement to every record at creation, not by matching names afterwards.",
        "Make the metric computable from a single query against that record.",
      ] },
      { type: "callout", title: "The test", text: "A well-designed operational record can answer your five key metrics without anyone opening a spreadsheet. If it cannot, the record is the problem." },
      { type: "p", text: "Firms that get this right stop treating month-end as an event. The report becomes a scheduled delivery, and the conversation moves from 'are these numbers right?' to 'what should we do about them?'" },
    ],
  },
  {
    slug: "ai-in-professional-services-without-the-hype",
    title: "Where AI genuinely helps a professional-services firm, and where it does not",
    excerpt:
      "AI is excellent at assembling, summarising and watching. It is poor at judgement and relationships. Designs that respect that division work; the rest disappoint.",
    category: "AI",
    author: AUTHORS.dev,
    publishedAt: "2026-06-24",
    readingMinutes: 10,
    featured: true,
    body: [
      { type: "p", text: "The failure mode of AI in professional services is not inaccuracy. It is the attempt to delegate judgement, which is the thing clients pay for. Systems that work draw a hard line between assembly and decision." },
      { type: "h2", text: "Where it is genuinely excellent" },
      { type: "ul", items: [
        "Assembling context: everything known about a client, before a call, in one page.",
        "Summarising long correspondence into decisions, commitments and open questions.",
        "Watching for absence: things that should have happened and have not.",
        "Drafting the shape of a message from a record, for a human to edit.",
        "Transcribing and structuring a meeting into next steps with owners.",
      ] },
      { type: "h2", text: "Where it should not be trusted" },
      { type: "ul", items: [
        "Conflict decisions, fee arrangements and anything with a regulatory edge",
        "Advice given directly to a client without a professional in the loop",
        "Judgements about which client matters more, or whose matter can wait",
        "Anything where the reasoning cannot be inspected afterwards",
      ] },
      { type: "h2", text: "The design rule we work to" },
      { type: "p", text: "The system prepares; the professional decides. Every automated output should be defensible on inspection — showing which email, document or call it came from — and reversible by the person accountable for it. If you cannot inspect the reasoning, you cannot sign the work." },
      { type: "callout", title: "Ask the vendor this", text: "Show me the source of that answer. If the answer is 'the model', the system is not suitable for client work." },
      { type: "h2", text: "What changes for the team" },
      { type: "p", text: "In firms that get this right, the pattern is consistent: hours shift from reconstruction to review, junior staff learn faster because context is available, and senior people spend less time being the only person who knows how something was done last time." },
    ],
  },
  {
    slug: "onboarding-week-one",
    title: "Week one decides the relationship: engineering client onboarding",
    excerpt:
      "The 14 days after a signature set expectations for the entire engagement. Most firms improvise them. Here is a repeatable path.",
    category: "Operations",
    author: AUTHORS.lena,
    publishedAt: "2026-06-10",
    readingMinutes: 7,
    body: [
      { type: "p", text: "At the point of signature, a client has just made a decision that felt significant. What follows is their first experience of how you actually work — and it is usually the least designed part of the firm." },
      { type: "h2", text: "The four things week one must deliver" },
      { type: "ol", items: [
        "Confirmation that the engagement is live, with names attached.",
        "A complete, unambiguous list of what is needed from them.",
        "A scheduled kickoff, with an agenda they can see in advance.",
        "Enough context transfer that the delivery team does not re-interview the client.",
      ] },
      { type: "h2", text: "Why documents stall" },
      { type: "p", text: "Document collection fails for one reason: the client cannot tell what is outstanding. A single email with a seven-item list produces four items and a follow-up conversation. A list with per-item status, that chases itself, produces all seven." },
      { type: "callout", title: "Make it visible to them", text: "Clients should be able to answer 'what do you need from me?' without asking. That single capability removes a large share of week-one frustration." },
      { type: "h2", text: "Handover is the part that gets skipped" },
      { type: "p", text: "The kickoff call is the cheapest context transfer your firm will ever perform — and it is frequently skipped when the partner who won the work is busy. Capture the commitments made at the point of sale, and hand over a record rather than a recollection." },
    ],
  },
  {
    slug: "key-person-risk-in-small-firms",
    title: "Key-person risk is an operations problem wearing a people costume",
    excerpt:
      "If three weeks of a colleague's absence would damage the firm, you have a documentation problem, not a staffing one.",
    category: "Operations",
    author: AUTHORS.maya,
    publishedAt: "2026-05-27",
    readingMinutes: 6,
    body: [
      { type: "p", text: "Every professional-services firm has one: the person who knows why the invoice was structured that way, which client prefers a call over an email, and how to get the report out of the system on a Friday. They are usually not the partner." },
      { type: "h2", text: "The three-week test" },
      { type: "p", text: "Take a specific person. Ask what breaks if they are unavailable for three weeks. If the honest answer involves a list of processes rather than a list of relationships, the process is stored in the wrong place." },
      { type: "h2", text: "Why documentation does not fix it" },
      { type: "ul", items: [
        "Documentation describes the intended process, which drifts from the real one",
        "It is written once and maintained never",
        "Nobody reads it during the week they need it",
      ] },
      { type: "p", text: "Systems that hold process fix it differently: the checklist is the work, so it cannot drift from reality. The knowledge is retrieved when it is needed, because it is attached to the record." },
      { type: "h2", text: "A cheaper form of insurance" },
      { type: "p", text: "Continuity is usually discussed as a succession issue, which makes it feel like a five-year conversation. It is more usefully treated as a weekly one: does the record contain what a competent colleague would need to take this over tomorrow?" },
    ],
  },
  {
    slug: "choosing-software-when-everyone-is-busy",
    title: "How to evaluate operations software when nobody has time to evaluate software",
    excerpt:
      "A short, honest evaluation protocol for firms buying under capacity pressure — including the questions vendors hope you will not ask.",
    category: "Growth",
    author: AUTHORS.ash,
    publishedAt: "2026-05-13",
    readingMinutes: 8,
    body: [
      { type: "p", text: "The firms that most need a better system are the ones with the least time to evaluate one. That asymmetry is why bad purchasing decisions get made: the shortest demo wins, and the cost is discovered in year two." },
      { type: "h2", text: "Run the same test on every vendor" },
      { type: "ol", items: [
        "Bring a real enquiry, from a real channel, and watch it become a record.",
        "Bring a real week of your inbox and see what the follow-up does with it.",
        "Ask to see a report your firm actually produces, produced from live data.",
        "Ask what happens at 90 days if adoption is poor — and who is accountable.",
      ] },
      { type: "h2", text: "Questions vendors hope you will not ask" },
      { type: "ul", items: [
        "What exactly does implementation require from us, in hours, from whom?",
        "What is the migration path out? Can we export everything, including history?",
        "Which of the promised integrations are live today, and which are roadmap?",
        "How is our data separated from other tenants', and can we see the evidence?",
      ] },
      { type: "callout", title: "The tell", text: "A vendor who cannot answer 'what does implementation cost us in internal hours' has not done enough implementations to be trusted with yours." },
      { type: "h2", text: "Buy the seam, not the feature list" },
      { type: "p", text: "Features are easy to add and hard to adopt. The thing worth paying for is the elimination of a specific seam — the gap where work currently goes missing. If a vendor cannot name which seam they remove, they are selling software rather than a change." },
    ],
  },
  {
    slug: "client-portal-what-clients-actually-want",
    title: "Clients do not want a portal. They want to stop asking.",
    excerpt:
      "Portals fail when they are built as a destination. They work when they answer one question: where are we up to?",
    category: "Operations",
    author: AUTHORS.lena,
    publishedAt: "2026-04-29",
    readingMinutes: 5,
    body: [
      { type: "p", text: "Most client portals are built from the firm's perspective: a place to put documents, messages and invoices. Clients rarely visit them, because a portal is a place they have to remember to go." },
      { type: "h2", text: "The one question worth answering" },
      { type: "p", text: "What clients actually want is to stop wondering. Where is the matter up to? Did they receive the document? Is the filing on track? A short, accurate answer to that question delivered proactively beats an elaborate portal nobody opens." },
      { type: "h2", text: "Design implications" },
      { type: "ul", items: [
        "Status is pushed, not only available",
        "What is needed from the client is always unambiguous",
        "Upload takes ten seconds and confirms receipt immediately",
        "Nobody has to create an account to receive an update",
      ] },
      { type: "callout", title: "Measure the right thing", text: "Not portal logins. The metric that matters is inbound 'where are we up to?' messages. If that count falls, the experience improved." },
    ],
  },
  {
    slug: "what-to-automate-first",
    title: "What to automate first: a ranking method that survives contact with reality",
    excerpt:
      "Everyone has a list. Almost nobody has a ranking. This is the scoring method we use, and the two criteria most firms leave out.",
    category: "AI",
    author: AUTHORS.dev,
    publishedAt: "2026-04-15",
    readingMinutes: 7,
    body: [
      { type: "p", text: "Automation lists are usually generated from annoyance rather than cost, which is why the first project is often a small win that changes nothing structural. Ranking the list properly takes an afternoon and saves a quarter." },
      { type: "h2", text: "Four criteria, weighted" },
      { type: "ol", items: [
        "Volume: how often does it happen? Hours per month, measured not estimated.",
        "Predictability: does it follow a rule, or does it need judgement every time?",
        "Blast radius: what happens to a client relationship when it goes wrong?",
        "Reversibility: if the automation is wrong, how hard is it to notice and undo?",
      ] },
      { type: "h2", text: "The two criteria firms leave out" },
      { type: "p", text: "Blast radius and reversibility. A high-volume, predictable task that silently damages a client relationship the first time it fails is a far worse first project than a lower-volume task where mistakes are loud and recoverable." },
      { type: "callout", title: "Start where failure is embarrassing, not fatal", text: "Your first automation should be one you can watch closely, where a mistake is visible and cheap, and where the team builds confidence from a real result." },
      { type: "h2", text: "Then stop and measure" },
      { type: "p", text: "The discipline that separates firms who benefit from automation from those who accumulate tools is the pause after each project: did the measured number move, yes or no? If it did not, do not proceed to the next one until you understand why." },
    ],
  },
];

export const postBySlug = Object.fromEntries(posts.map((post) => [post.slug, post])) as Record<string, Post>;

export const blogCategories = [
  "All",
  "Operations",
  "Intake",
  "Follow-up",
  "Reporting",
  "AI",
  "Growth",
] as const;

export const allAuthors = Object.values(AUTHORS);
