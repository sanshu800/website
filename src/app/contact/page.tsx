import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Reygent team about pricing, security review, partnerships or support.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: Mail,
    label: "General",
    value: "hello@reygent.ai",
    note: "Sales, trials and anything that does not fit elsewhere.",
  },
  {
    icon: MessageSquare,
    label: "Support",
    value: "support@reygent.ai",
    note: "Existing customers. Pro and Enterprise include a priority queue.",
  },
  {
    icon: Clock,
    label: "Security",
    value: "security@reygent.ai",
    note: "Vulnerability reports and security questionnaires.",
  },
  {
    icon: MapPin,
    label: "Registered office",
    value: "1 Fitzwilliam Square, Dublin 2, Ireland",
    note: "Postal enquiries. We are remote-first; no drop-ins, please.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Ask us something specific."
        summary="Every message is read by a person on the team that can actually answer it. If your question is about the platform, expect a technical reply rather than a brochure."
      />

      <section className="section bg-paper">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[1.5rem] text-ink">Send a message</h2>
              <p className="mt-3 text-body-lg text-fog">
                Required fields are marked by their labels being visible. Everything is
                validated on the server as well as here.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="rounded-2xl border border-line bg-mist p-7">
                  <h2 className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                    Direct channels
                  </h2>
                  <ul className="mt-6 space-y-6">
                    {CHANNELS.map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <li key={channel.label} className="flex gap-4">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
                          <div>
                            <p className="font-mono text-[0.625rem] uppercase tracking-wide text-fog-2">
                              {channel.label}
                            </p>
                            <p className="mt-1.5 text-[0.9375rem] font-medium text-ink">
                              {channel.value}
                            </p>
                            <p className="mt-1 text-[0.75rem] text-fog">{channel.note}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-6 rounded-2xl border border-line p-7">
                  <h2 className="font-display text-[1.0625rem] text-ink">
                    Already evaluating?
                  </h2>
                  <p className="mt-2.5 text-micro text-fog">
                    Ask for the security pack and a sandbox with your own data model. We
                    would rather answer a hundred questions before you sign than ten
                    after.
                  </p>
                  <p className="mt-4 text-[0.6875rem] text-fog-2">
                    Addresses on this page are placeholders. Point them at a real mailbox
                    (or a shared inbox integration) before going live.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
