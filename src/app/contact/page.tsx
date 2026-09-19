import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPages } from "@/lib/cms/content";
import { withSeo } from "@/lib/cms/seo";
import { Reveal } from "@/components/motion/Reveal";
import { withText } from "@/lib/cms/paths";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/contact", {
    title: "Contact",
    description:
      "Tell us what you need automated and what it is costing you. A person replies to every enquiry within one business day.",
    alternates: { canonical: "/contact" },
  });
}

/** Icons are code, not content: the document supplies the text, position pairs them. */
const CHANNEL_ICONS = [Mail, MessageSquare, Clock, MapPin];

export default function ContactPage() {
  const { contact: copy } = getPages();
  const channels = withText(copy.channels).map((channel, index) => ({
    ...channel,
    icon: CHANNEL_ICONS[index] ?? Mail,
  }));

  return (
    <>
      <PageHero
        title={copy.hero.title}
        summary={copy.hero.summary}
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <h2 className="font-display text-display-m text-ink">{copy.formHeading}</h2>
              <p className="mt-3 text-body text-fog">{copy.formNote}</p>
              <div className="mt-8">
                <EnquiryForm kind="contact" />
              </div>
            </div>

            <div className="lg:col-span-4">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-mono text-label uppercase tracking-label text-fog">
                    {copy.channelsHeading}
                  </h2>
                  <ul className="mt-6 space-y-6">
                    {withText(channels).map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <li key={channel.label} className="flex gap-4">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                          <div>
                            <p className="font-mono text-label uppercase tracking-label text-fog">
                              {channel.label}
                            </p>
                            <p className="mt-1.5 text-body font-medium text-ink">
                              {channel.value}
                            </p>
                            <p className="mt-1 text-label text-fog">{channel.note}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="font-display text-body text-ink">
                    {copy.evaluating.heading}
                  </h2>
                  <p className="mt-2.5 text-small text-fog">{copy.evaluating.body}</p>
                  <p className="mt-4 text-eyebrow text-fog">{copy.evaluating.note}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
