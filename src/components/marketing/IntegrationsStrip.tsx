import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { integrations } from "@/lib/content/marketing";

/**
 * Integrations described by capability rather than by partner logo. Naming and
 * displaying third-party marks implies an endorsement we do not have, so the
 * surfaces are listed instead — which is also more useful to a buyer.
 */
export function IntegrationsStrip() {
  return (
    <section className="section bg-paper">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Integrations"
            title="Runs alongside what you already use."
            lede="Forty-plus integration surfaces across the systems a professional-services firm already depends on. Nothing needs to be ripped out to start."
            className="max-w-[40rem]"
          />
          <Link
            href="/integrations"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-violet"
          >
            All integrations
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((group) => (
            <RevealItem key={group.category}>
              <div className="flex h-full flex-col rounded-2xl border border-line p-6">
                <h3 className="font-display text-[1.0625rem] text-ink">
                  {group.category}
                </h3>
                <p className="mt-2.5 flex-1 text-micro text-fog">{group.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {group.surfaces.map((surface) => (
                    <li
                      key={surface}
                      className="rounded-full border border-line bg-mist px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wide text-fog"
                    >
                      {surface}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
