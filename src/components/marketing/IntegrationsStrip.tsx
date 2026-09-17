import { Container, SectionHeading } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getHome, getShared } from "@/lib/cms/content";

/**
 * Integrations described by capability rather than by partner logo. Naming and
 * displaying third-party marks implies an endorsement we do not have, so the
 * surfaces are listed instead — which is also more useful to a buyer.
 */
export function IntegrationsStrip() {
  const { integrations } = getShared();
  const { integrations: copy } = getHome();

  return (
    <section className="section bg-paper">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title={copy.title}
            lede={copy.lede}
            className="max-w-[40rem]"
          />
          <ArrowLink href="/integrations">{copy.cta}</ArrowLink>
        </div>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((group) => (
            <RevealItem key={group.category}>
              <div className="flex h-full flex-col rounded-2xl border border-line p-6">
                <h3 className="font-display text-body text-ink">
                  {group.category}
                </h3>
                <p className="mt-2.5 flex-1 text-small text-fog">{group.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {group.surfaces.map((surface) => (
                    <li
                      key={surface}
                      className="rounded-full border border-line bg-mist px-2.5 py-1 font-mono text-label uppercase tracking-label text-fog"
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
