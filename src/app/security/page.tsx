import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { PageHero, PageCTA } from "@/components/marketing/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { legalPages } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Reygent protects client data: encryption, tenant isolation, access control, audit logging, testing and incident response.",
  alternates: { canonical: "/security" },
};

const POSTURE = [
  { label: "Encryption in transit", value: "TLS 1.2+" },
  { label: "Encryption at rest", value: "AES-256" },
  { label: "Tenant isolation", value: "Per-firm boundary" },
  { label: "Audit trail", value: "Append-only" },
  { label: "Penetration test", value: "Annual, third party" },
  { label: "SOC 2 Type II", value: "In progress" },
];

export default function SecurityPage() {
  const page = legalPages.security;

  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Specifics, not adjectives."
        summary={page.intro}
        actions={
          <>
            <Link
              href="/legal/security"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-2"
            >
              Full security documentation
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-paper px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
            >
              Request our DPA
            </Link>
          </>
        }
      />

      <section className="section-sm border-b border-line bg-mist">
        <Container width="wide">
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {POSTURE.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-fog-2">
                  {item.label}
                </dt>
                <dd className="text-[0.9375rem] font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <SectionHeading
            eyebrow="Controls"
            title="What we do, in the order it matters."
          />
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {page.sections.map((section, index) => (
              <RevealItem key={section.h}>
                <div className="flex gap-5 border-t border-line pt-5">
                  <span className="font-mono text-[0.6875rem] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-[1.0625rem] font-medium text-ink">{section.h}</h2>
                    <p className="mt-2.5 text-micro text-fog">{section.p}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="section-sm border-y border-line bg-ink text-on-ink">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <ShieldCheck className="h-6 w-6 text-accent-3" aria-hidden="true" />
              <h2 className="mt-5 text-display-m text-on-ink">
                Report a vulnerability
              </h2>
              <p className="mt-4 max-w-[38rem] text-body-lg text-on-ink-2">
                We run a coordinated disclosure process and will not pursue legal action
                against researchers who follow it. Send a description and reproduction
                steps; we acknowledge within two working days and keep you updated until
                the fix ships.
              </p>
            </div>
            <div className="lg:col-span-5">
              <a
                href="mailto:security@reygent.ai"
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-ink-2 px-6 py-5 transition-colors hover:border-accent-3/40"
              >
                <Lock className="h-5 w-5 text-accent-3" aria-hidden="true" />
                <span className="text-body text-on-ink">
                  security@reygent.ai
                  <span className="mt-0.5 block text-[0.75rem] text-on-ink-2">
                    PGP key available on request
                  </span>
                </span>
              </a>
              <p className="mt-4 text-[0.75rem] text-on-ink-2">
                Placeholder address — point this at a real mailbox before publishing.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA
        title="Need our security pack?"
        summary="Questionnaire responses, sub-processor list, penetration test summary under NDA and a draft DPA are available for firms in evaluation."
        primary={{ href: "/contact", label: "Request the pack" }}
        secondary={{ href: "/legal/privacy", label: "Privacy notice" }}
      />
    </>
  );
}
