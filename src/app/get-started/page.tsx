import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { GetStartedForm } from "@/components/forms/GetStartedForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Start a 14-day Reygent trial — full product, no card, your data exportable at any time.",
  alternates: { canonical: "/get-started" },
};

const INCLUDED = [
  "All four modules — intake, engage, deliver and insight — live from day one",
  "Foundation: the shared memory layer every module reads and writes to",
  "Two sample workflows and the seed data model to copy from",
  "Import from a spreadsheet in under ten minutes",
  "Guided onboarding session on Pro and above",
  "Full export in open formats, whenever you want it",
];

export default function GetStartedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title="Fourteen days, full product, no card."
        summary="Most firms see whether this fits inside a week. You should be able to decide that without talking to us first, so the trial is not gated behind a discovery call."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <GetStartedForm />
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-display text-[1.0625rem] text-ink">
                    What the trial includes
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-micro text-fog">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-violet" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="text-[0.9375rem] font-medium text-ink">
                    What happens after you submit
                  </h2>
                  <ol className="mt-5 space-y-4 text-micro text-fog">
                    <li className="flex gap-3">
                      <span className="font-mono text-[0.625rem] text-violet">01</span>
                      The request is stored and acknowledged — no silent submission.
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-[0.625rem] text-violet">02</span>
                      You create an account and land in the dashboard with sample data
                      loaded.
                    </li>
                    <li className="flex gap-3">
                      <span className="font-mono text-[0.625rem] text-violet">03</span>
                      Import a slice of your real records, or book an onboarding session
                      and we will do it with you.
                    </li>
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 rounded-xl border border-line bg-mist px-5 py-4 text-[0.75rem] leading-relaxed text-fog">
                  No payment provider is wired into this build. Selecting a plan records
                  your intent so the flow is complete end to end; real billing needs a
                  Stripe account and price IDs.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
