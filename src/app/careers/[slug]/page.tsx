import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageCTA } from "@/components/marketing/PageHero";
import { getCompany } from "@/lib/cms/content";
import { ApplicationPanel, CancelApplication } from "@/components/forms/ApplicationPanel";

export function generateStaticParams() {
  return getCompany().careers.roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getCompany().careers.roles.find((item) => item.slug === slug);
  if (!role) return { title: "Not found" };
  return {
    title: `${role.title} — ${role.team}`,
    description: role.summary,
    alternates: { canonical: `/careers/${role.slug}` },
  };
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { careers } = getCompany();
  const role = careers.roles.find((item) => item.slug === slug);
  if (!role) notFound();

  return (
    <>
      <section className="border-b border-line bg-paper pb-12 pt-28 sm:pt-32 lg:pt-36">
        <Container width="wide">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-wide text-fog transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All roles
          </Link>
          <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-wide text-accent">
            {role.team}
          </p>
          <h1 className="mt-4 text-display-xl text-ink">{role.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-micro text-fog">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {role.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {role.type}
            </span>
            <span className="font-medium text-ink">{role.salary}</span>
          </div>
        </Container>
      </section>

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="text-lead text-fg-2">{role.summary}</p>

              <h2 className="mt-12 font-display text-[1.25rem] text-ink">
                What you will do
              </h2>
              <ul className="mt-5 space-y-3">
                {role.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-lg text-fog">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-[1.25rem] text-ink">
                What we are looking for
              </h2>
              <ul className="mt-5 space-y-3">
                {role.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-lg text-fog">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 rounded-2xl border border-line bg-mist p-6">
                <h2 className="font-display text-[1.0625rem] text-ink">
                  How our process works
                </h2>
                <ol className="mt-4 space-y-3 text-micro text-fog">
                  {[
                    "A 30-minute introduction call — your questions, ours.",
                    "A paid work sample based on a real problem, not a whiteboard puzzle.",
                    "A conversation with the team you would work with day to day.",
                    "A decision within five working days of the final conversation.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-mono text-[0.6875rem] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <ApplicationPanel roleTitle={role.title} slug={role.slug} />
                <CancelApplication />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <PageCTA
        title={careers.roleCta.title}
        summary={careers.roleCta.summary}
        primary={careers.roleCta.primary}
        secondary={careers.roleCta.secondary}
      />
    </>
  );
}
