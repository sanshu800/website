import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * The problem.
 *
 * Three concrete operational failures rather than an abstract argument, each
 * paired with a grayscale editorial photograph under a saturated colour field —
 * the same treatment our product pages use for product surfaces, applied here
 * to the problem to keep one visual language across the site.
 */

type Problem = {
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Colour field behind the image. */
  field: string;
  /** The fix, stated as an outcome. */
  fix: string;
  stat: { value: string; label: string };
};

const PROBLEMS: Problem[] = [
  {
    title: "Enquiries sit in somebody's inbox",
    body: "A web form nobody owns, a shared mailbox and a partner's phone notes. Nobody can say how many enquiries arrived this month, or how many were answered.",
    image: "/images/problem-scattered.png",
    alt: "An overhead view of a desk buried in scattered printed spreadsheets, folders and paper notes",
    field: "bg-accent",
    fix: "One record per enquiry, with an owner and a dated next step.",
    stat: { value: "38m", label: "typical discovery: slowest firm replies in 22 hours" },
  },
  {
    title: "The chasing never stops",
    body: "Half of client correspondence is asking for something again — a document, an approval, a signature. It is invisible work that consumes senior time every week.",
    image: "/images/problem-chasing.png",
    alt: "A professional at an office desk on a headset, surrounded by open folders and paperwork",
    field: "bg-tangerine",
    fix: "Requests that carry their own status and chase themselves.",
    stat: { value: "1 in 3", label: "client emails in a typical firm are chasing something" },
  },
  {
    title: "Reporting is a reconstruction",
    body: "Month-end means exports, cleanup and a manual join. Two people produce two numbers, and the review meeting spends its first twenty minutes agreeing on which one is right.",
    image: "/images/problem-reporting.png",
    alt: "Hands at a keyboard in a dim office with spreadsheet grids visible on monitors behind",
    field: "bg-azure",
    fix: "Reports assembled from the operating record, on a schedule.",
    stat: { value: "3 days", label: "average month-end reporting effort, per firm" },
  },
];

export function ProblemSection() {
  return (
    <section className="relative bg-ink py-24 text-on-ink sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="grid-field-dark pointer-events-none absolute inset-0 opacity-40"
      />
      <Container width="wide" className="relative">
        <SectionHeading
          tone="ink"
          eyebrow="The problem"
          title={
            <>
              Your tools each see a fragment.
              <br className="hidden sm:block" /> None of them sees the client.
            </>
          }
          lede="An inbox sees threads. A CRM sees fields. A document store sees files. The work that holds a firm together happens between them — where an enquiry becomes a client, and where most of it goes missing."
          className="max-w-[54rem]"
        />

        <div className="mt-16 space-y-6 sm:mt-20 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {PROBLEMS.map((problem, index) => (
            <Reveal
              key={problem.title}
              delay={index * 0.08 }
              className="group h-full"
              variant="up"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-2">
                <div className={cn("relative aspect-[16/11] overflow-hidden", problem.field)}>
                  <Image
                    src={problem.image}
                    alt={problem.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-90 mix-blend-luminosity transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-display-s text-on-ink">{problem.title}</h3>
                  <p className="mt-3 text-small text-on-ink-2">{problem.body}</p>

                  <div className="mt-6 flex items-baseline gap-3 border-t border-white/10 pt-5">
                    <span className="font-display text-[1.75rem] leading-none text-on-ink">
                      {problem.stat.value}
                    </span>
                    <span className="text-[0.75rem] leading-snug text-on-ink-2">
                      {problem.stat.label}
                    </span>
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-white/5 p-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-3"
                    />
                    <p className="text-[0.8125rem] leading-snug text-on-ink">
                      {problem.fix}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 max-w-[46rem] border-t border-white/10 pt-8 text-body-lg text-on-ink-2">
          None of this is a people problem. It is a design problem — and it is the
          specific design problem this platform exists to solve.
        </p>
      </Container>
    </section>
  );
}
