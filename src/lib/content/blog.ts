/**
 * Editorial content.
 *
 * Posts are stored as structured blocks so the index, article template, related
 * reading and RSS all read from one source. Writing bodies as data keeps the
 * article page a pure renderer.
 *
 * Voice: written for an owner-run business, not for a software buyer. No
 * thought leadership, no product story — a method, a number, or an honest
 * account of something we got wrong.
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
  category: "Automation" | "Customers" | "Money" | "Operations" | "AI" | "Buying";
  author: { name: string; role: string };
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  body: Block[];
};

const AUTHORS = {
  maya: { name: "Maya Okonjo", role: "Process Analyst" },
  dev: { name: "Dev Sharma", role: "Founder" },
  lena: { name: "Lena Fischer", role: "Head of Delivery" },
  ash: { name: "Ash Mottram", role: "AI Engineer" },
} as const;

export const posts: Post[] = [
  {
    slug: "what-the-manual-work-actually-costs",
    title: "What the manual work actually costs you, in four numbers",
    excerpt:
      "Before you spend anything on AI, put a number on the work you want to remove. This is the audit we run in the first week, and you can run it yourself on a Friday afternoon.",
    category: "Money",
    author: AUTHORS.maya,
    publishedAt: "2026-08-19",
    readingMinutes: 9,
    featured: true,
    body: [
      {
        type: "p",
        text: "Almost every owner who calls us already knows something is wrong. Very few can say what it costs. That gap is the whole reason our first week is an audit: four measurements, ninety minutes each, and a number you can take to your accountant or your business partner without blushing.",
      },
      { type: "h2", text: "One: how fast you answer" },
      {
        type: "p",
        text: "Take the last twenty enquiries you received — calls, forms, messages, whatever they came through. For each one, note when it arrived and when somebody replied with something substantive. Not an acknowledgement; a reply that moved the enquiry forward. Then take the median. Businesses that believe they answer within an hour usually discover the median is between six and twenty-two hours, because the list runs into the evening and nobody counted the ones that came in while they were on a job.",
      },
      {
        type: "callout",
        title: "Use the median, not the average",
        text: "One enquiry answered in three minutes and one answered next Tuesday average to something flattering and useless. The median is what your typical customer actually experiences.",
      },
      { type: "h2", text: "Two: how much of the week is unskilled work" },
      {
        type: "p",
        text: "Sit with one person for a morning and write down every task that is copying, retyping, chasing, checking, filing or formatting. Every one of them. At the end of the morning you will have a list, and it is usually longer than the person doing the work expects, because none of it feels like a task while you are in it.",
      },
      {
        type: "callout",
        title: "Do not skip the interruptions",
        text: "The real cost is rarely the two minutes the task takes. It is the twenty minutes of attention it costs the person doing something else, twice a day, forever.",
      },
      { type: "h2", text: "Three: what you cannot answer because the data is in the wrong place" },
      {
        type: "p",
        text: "Write down the five questions you would like to answer about your business at any moment. Which customers have gone quiet. What that job actually made. Which service line is losing money. How many quotes are outstanding and for how long. Now time yourself working out the answer from the systems you have. If it takes an afternoon, that is not a reporting problem, it is a process problem — and it costs you every decision you make without it.",
      },
      {
        type: "ul",
        items: [
          "The report needs an export, a cleanup and a manual join",
          "Two people produce two different versions of the same number",
          "The definition of the number changes depending on who you ask",
        ],
      },
      { type: "h2", text: "Four: report assembly time" },
      {
        type: "p",
        text: "Time how long it takes to produce the report you send most often, from opening the first export to hitting send. Multiply it by how many times you produce it in a year. This number usually ends the debate at home, because it is paid in the most expensive hours you have — yours, or somebody senior's.",
      },
      { type: "h2", text: "What to do with the four numbers" },
      {
        type: "ol",
        items: [
          "Add them up and write it down. The first effect of measurement is that the gap stops being a matter of opinion.",
          "Rank by cost, not by irritation. The loudest problem is rarely the most expensive one.",
          "Fix one thing completely before starting the second. Half-automated processes create new seams.",
          "Re-measure in ninety days. If the number has not moved, whatever you did was theatre.",
        ],
      },
      {
        type: "quote",
        text: "We assumed we needed more leads. The audit showed we were generating plenty and losing a quarter of them to slow replies.",
        attribution: "Owner, commercial fit-out contractor",
      },
      {
        type: "p",
        text: "You do not need AI to run this audit, and you do not need us. You need ninety minutes and the willingness to look at the median rather than the best case. Businesses that do it usually find the same thing: the work is not the problem, the gaps between the work are.",
      },
    ],
  },
  {
    slug: "the-business-that-replies-first",
    title: "The business that replies first usually gets the job.",
    excerpt:
      "Nobody chooses the second contractor to reply unless they were recommended. The first hour of an enquiry decides whether you were ever really in the running.",
    category: "Customers",
    author: AUTHORS.dev,
    publishedAt: "2026-08-05",
    readingMinutes: 6,
    featured: true,
    body: [
      {
        type: "p",
        text: "Ask any owner what wins work and you will hear: reputation, price, relationships. All true, and all second-order. Long before any of that matters, the enquiry arrives, and whoever answers it first sets the terms of the conversation.",
      },
      { type: "h2", text: "Why speed beats almost everything else" },
      {
        type: "p",
        text: "Somebody with a leaking roof is not comparing quotes in a spreadsheet. They are ringing three firms and waiting to see which one comes back. The one that replies while the problem is still front of mind is the one they talk to, and the one who shapes what the job involves — including the price bracket.",
      },
      { type: "h2", text: "Why nobody is answering in the evening" },
      {
        type: "ul",
        items: [
          "The phone rings while everyone is doing the work that pays for the phone",
          "Messages land in three places and nobody owns any of them",
          "The person who could qualify it is the most expensive person in the business",
          "Nothing is measured, so nobody knows it is a problem",
        ],
      },
      { type: "h2", text: "What actually changes the number" },
      {
        type: "ol",
        items: [
          "One front door. Every channel creates the same record, so nothing hides in a personal inbox or a voicemail nobody checks.",
          "A dated next step on every enquiry. A record cannot rest without an owner and a date — that one rule removes most silent loss.",
          "Calls and messages handled for you. It answers in seconds, asks your questions, books the visit, and hands the awkward ones to a person with the thread attached.",
        ],
      },
      {
        type: "callout",
        title: "The uncomfortable version",
        text: "If you cannot state your median time to first reply, you do not currently know whether you are losing work to it. That is the finding, not the fix.",
      },
      {
        type: "p",
        text: "None of this requires more staff. It requires treating the first hour as part of the job you sell, and then measuring it like you would any other part.",
      },
    ],
  },
  {
    slug: "what-to-automate-first",
    title: "What to automate first: a ranking method that survives contact with reality",
    excerpt:
      "Everyone has a list of things that should be automated. The list is not ranked by what pays back first, which is why so many first projects quietly fail.",
    category: "Automation",
    author: AUTHORS.ash,
    publishedAt: "2026-07-30",
    readingMinutes: 8,
    featured: true,
    body: [
      {
        type: "p",
        text: "The first thing you automate is the most consequential technical decision most businesses make this year, because it decides whether there is a second one. Rank by four scores and the choice stops being a matter of taste.",
      },
      { type: "h2", text: "Score each candidate out of five" },
      {
        type: "ul",
        items: [
          "Frequency: how often does it happen? Daily beats monthly by a mile.",
          "Cost: what does it consume — hours, wages, or somebody senior's attention?",
          "Determinism: are the rules clear enough to write down? If nobody can explain the exceptions, that is a process problem first.",
          "Blast radius: if it goes wrong quietly, what does it cost you? A misfiled receipt is not a mispriced quote.",
        ],
      },
      {
        type: "p",
        text: "Then subtract points for how many systems it touches. A task that lives inside one system is a week's work. The same task spread across five is a project, and a bad first project.",
      },
      {
        type: "callout",
        title: "Start where failure is embarrassing, not fatal",
        text: "Your first automation should be one you can watch closely, where a mistake is visible and cheap, and where the team builds confidence from a real result rather than a pilot nobody uses.",
      },
      { type: "h2", text: "The six we automate most, in the order they usually rank" },
      {
        type: "ol",
        items: [
          "Answering and qualifying enquiries — high frequency, directly revenue-bearing, rules are knowable.",
          "Quotes and follow-up — the most commonly abandoned money in a small business.",
          "Invoice and document processing — tedious, but the rules are usually written down somewhere already.",
          "Scheduling and reminders — removes the no-shows and the double bookings without changing your diary.",
          "Onboarding a new customer or job — the checklist nobody maintains consistently once you are busy.",
          "Reporting — last, because it is worthless until the work it reports on actually runs through a system.",
        ],
      },
      {
        type: "p",
        text: "Note what is missing from that list: anything requiring judgement about a customer, a price, or a legal position. Those stay with people, permanently, and any project that starts by moving them is aimed at the wrong target.",
      },
      { type: "h2", text: "What good looks like at the end of week six" },
      {
        type: "p",
        text: "One process running in production, measured against a baseline you agreed before anyone built anything, with an owner inside the business who can explain how it works and what to do when it misfires. If those four things are true, the second project will be easier to justify than the first.",
      },
    ],
  },
  {
    slug: "questions-to-ask-an-ai-agency",
    title: "Twelve questions to ask before you hire an automation company",
    excerpt:
      "Most agencies can talk confidently for an hour. These twelve questions separate the ones who have shipped for businesses like yours from the ones who have not.",
    category: "Buying",
    author: AUTHORS.dev,
    publishedAt: "2026-07-16",
    readingMinutes: 9,
    body: [
      {
        type: "p",
        text: "We are the people being questioned, so treat this with the appropriate suspicion. But the questions are the ones we would ask, and the good answers are specific rather than impressive.",
      },
      { type: "h2", text: "About the work itself" },
      {
        type: "ol",
        items: [
          "What would you not automate here? — A good answer names something specific and explains why. An agency that says yes to everything has not understood your business yet.",
          "Who will actually build it, and have I met them? — You should know whether you are buying a person or a sales process.",
          "What happens when it gets something wrong? — Look for an alert to a named human, a review queue, and a defined escalation. Not 'it won't'.",
          "How will we know it is working in ninety days? — There should be a number agreed before the build starts.",
          "What do you need from my team, in hours? — A real figure. If it is vague, you will pay in a different currency later.",
        ],
      },
      { type: "h2", text: "About money" },
      {
        type: "ol",
        items: [
          "Is this a fixed price, and what changes it? — Scope changes should be named in writing, not discovered on an invoice.",
          "What will I be paying in year two? — Some agencies quote a build and do not mention the retainer required to keep it accurate. Ask.",
          "What if the first stage does not work? — A clean answer exists: you stop, and you pay for the stage you received.",
        ],
      },
      { type: "h2", text: "About ownership and risk" },
      {
        type: "ol",
        items: [
          "Who owns the build, the prompts and the accounts? — If the answer is not 'you', you are renting your own operations.",
          "What access do you need to my systems, and can I revoke it? — Least privilege is a two-minute answer for anyone who does this properly.",
          "Which model providers are in the path of my data, and do they train on it? — A specific answer, not a policy page.",
          "If I ended this tomorrow, what would stop working? — Everything should keep running. It would simply stop being maintained and improved.",
        ],
      },
      {
        type: "callout",
        title: "The tell",
        text: "An agency that cannot answer 'what does the implementation cost us in internal hours' has not done enough of them to be trusted with yours.",
      },
      {
        type: "p",
        text: "One more, worth asking last: what have you built that a business decided not to keep? The answer tells you far more about a supplier than any case study, because it shows what happens when the work is not working.",
      },
    ],
  },
  {
    slug: "voice-agents-what-they-get-wrong",
    title: "AI phone answering: the three things that go wrong, and how we test for them",
    excerpt:
      "A phone assistant that sounds convincing and books the wrong job is worse than voicemail. Here is where the failures actually come from.",
    category: "AI",
    author: AUTHORS.ash,
    publishedAt: "2026-07-02",
    readingMinutes: 8,
    body: [
      {
        type: "p",
        text: "The demo is the easy part. A phone assistant on a clean line, with an articulate caller and a scripted question, sounds better than most receptionists. The trouble starts on a Tuesday with a bad connection and somebody whose boiler has just flooded the kitchen.",
      },
      { type: "h2", text: "One: it agrees to things you did not agree to" },
      {
        type: "p",
        text: "The most common failure is not misunderstanding, it is helpfulness. It says a job will be done tomorrow, or quotes a price from memory, because the caller is upset and it wants to reassure them. Every number, arrival window and commitment must come from your data, and if it is not there it books a callback rather than improvising.",
      },
      {
        type: "callout",
        title: "How we test it",
        text: "We take fifty real calls from the client's history — including the rude ones and the ones where the caller changes their mind halfway — and run them against it. Anything it commits to that is not in the record is a failure, even if the caller was delighted.",
      },
      { type: "h2", text: "Two: it does not know when to stop" },
      {
        type: "p",
        text: "Systems that handle the first four minutes well can flounder for the next ten. The fix is not a better model, it is a shorter leash: a defined point at which it hands over to a person, based on keywords, sentiment, or the number of failed attempts to understand. We would rather it escalate early than be impressive for too long.",
      },
      { type: "h2", text: "Three: nobody listens to the calls" },
      {
        type: "p",
        text: "Every call is transcribed, and the first week of real traffic is the most useful training material you will ever have. The businesses that get the most from phone answering are the ones who review the recordings in week one and tell us what it got wrong. That loop is the difference between a system that is 85% right forever and one that is 97% right by month two.",
      },
      { type: "h2", text: "What we would not put on the phone" },
      {
        type: "ul",
        items: [
          "Anything clinical, legal or financial where a person's circumstances matter more than the script",
          "Complaints from an existing customer — they should reach a human on the second sentence",
          "Negotiation of any kind, including discounts and payment terms",
        ],
      },
      {
        type: "p",
        text: "Used properly, it answers the calls you currently miss, in a business where a missed call is a missed job. Used carelessly, it is an answering machine with better manners. The difference is almost entirely in the rules and the testing, not the voice.",
      },
    ],
  },
  {
    slug: "if-you-rebuild-the-same-report-every-month",
    title: "If you rebuild the same report every month, the problem is not your workload",
    excerpt:
      "Reporting that has to be reconstructed is a design failure. The numbers you need should fall out of how the work is recorded, not be rescued from it afterwards.",
    category: "Operations",
    author: AUTHORS.maya,
    publishedAt: "2026-06-18",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        text: "There is a particular kind of tiredness that comes from producing a number you have produced eleven times before. The work is not hard. It is work that should not exist.",
      },
      { type: "h2", text: "Three symptoms" },
      {
        type: "ul",
        items: [
          "The report needs an export, a cleanup and a manual join",
          "Two people produce different versions of the same figure",
          "The definition of a number changes depending on who you ask",
        ],
      },
      { type: "h2", text: "Agree the definition before you touch the tools" },
      {
        type: "p",
        text: "Most reporting projects start with a dashboard and stall because the metric was never agreed. Write down, in one sentence, what the number means and what it excludes. 'Gross margin: invoiced value less materials, subcontractors and directly attributed labour, excluding overheads and quoted-not-won work.' If two people disagree with that sentence, no tooling will reconcile them.",
      },
      { type: "h2", text: "Then fix where the work is recorded" },
      {
        type: "ol",
        items: [
          "Record the event where it happens, not in a reconstruction three weeks later",
          "Attach the customer, the job and the cost to every record as it is created",
          "Make each number computable from that record without a human joining anything",
        ],
      },
      {
        type: "callout",
        title: "The test",
        text: "A well-designed process can answer your five key numbers without anyone opening a spreadsheet. If it cannot, the process is the problem — and no reporting tool will fix a process that loses information as it runs.",
      },
      {
        type: "p",
        text: "Businesses that get this right stop treating month end as an event. The report arrives on schedule, and the meeting moves from 'are these numbers right' to 'what are we doing about them'.",
      },
    ],
  },
  {
    slug: "automate-or-hire",
    title: "Automate, or hire? A way to decide without guessing",
    excerpt:
      "Both cost money and both take time. The deciding factor is almost never the wage — it is whether the work varies, and who is currently doing it.",
    category: "Money",
    author: AUTHORS.lena,
    publishedAt: "2026-06-04",
    readingMinutes: 7,
    body: [
      {
        type: "p",
        text: "When a business is busy enough that one more person does not cover it, the instinct is to hire. Sometimes that is right. Often the role you are about to advertise is mostly the repetitive layer, and you will be paying a salary to problems software should own.",
      },
      { type: "h2", text: "Three questions that decide it" },
      {
        type: "ol",
        items: [
          "Does the work vary, or is it mostly the same shape every time? Variation means judgement, and judgement means people.",
          "Does it need to happen immediately, often outside working hours? That points at automation, because people are expensive at 9pm.",
          "Would you be proud to describe this role to the person doing it? If the job is mostly retyping, they will not stay, and you will be hiring again in a year.",
        ],
      },
      { type: "h2", text: "The hybrid answer most businesses actually need" },
      {
        type: "p",
        text: "The strongest pattern we see is not automation instead of people, it is automation in front of people. Every enquiry answered in seconds, qualified against your rules, and handed to a human only when there is a decision to make. The same headcount handles noticeably more work, and the work they handle is the part they were hired for.",
      },
      {
        type: "callout",
        title: "A rough way to compare",
        text: "Take the salary you would pay, including employer costs, and divide it by the hours of repetitive work that role would absorb in a year. That gives you a cost per hour of automated work. Compare it with the fixed price of building the automation, and remember one is paid every year and the other is paid once.",
      },
      {
        type: "p",
        text: "Hire when the work needs judgement, relationships or a person present in the room. Automate when it needs to happen fast, repeatably, and out of hours. When you cannot tell which it is, that is usually a sign the process has never been written down — which is where every project we run starts anyway.",
      },
    ],
  },
  {
    slug: "key-person-risk",
    title: "Key-person risk is an operations problem wearing a people costume",
    excerpt:
      "One person knows how the quotes are calculated, one person knows how the month-end works, and neither of them has had a proper holiday in two years.",
    category: "Operations",
    author: AUTHORS.lena,
    publishedAt: "2026-05-21",
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "Every business has two or three people whose absence would be a crisis. That is usually treated as a fact of life, or a compliment. It is neither: it is a description of where your knowledge lives, and it means your business is one resignation away from an expensive month.",
      },
      { type: "h2", text: "The three-week test" },
      {
        type: "p",
        text: "Pick the person who carries the most undocumented process. Imagine them unavailable for three weeks, with no contact. Now answer three questions honestly: what stops, what gets done badly, and who already knows how to do it? Most owners can answer the first two quickly and stall on the third.",
      },
      { type: "h2", text: "Write down what you just discovered" },
      {
        type: "ol",
        items: [
          "The steps, in order, including the exceptions and the workarounds",
          "The systems and logins each step depends on",
          "Where the judgement happens, which cannot be written down and should be named someone's responsibility",
        ],
      },
      {
        type: "callout",
        title: "The point of the exercise",
        text: "The document is not the deliverable. The deliverable is that half of those steps are exactly the kind of thing an automation should be doing — leaving a much shorter list of judgement calls that genuinely need a person.",
      },
      {
        type: "p",
        text: "Businesses that do this once tend to find the same thing: the process was never as complicated as the dependency made it feel, and the person holding it has wanted to hand part of it over for a long time.",
      },
    ],
  },
];

export const blogCategories = [
  "All",
  "Automation",
  "Customers",
  "Money",
  "Operations",
  "AI",
  "Buying",
] as const;

export const allAuthors = Object.values(AUTHORS);
