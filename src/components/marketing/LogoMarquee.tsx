import { getShared } from "@/lib/cms/content";
import { ClientWordmark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Client marquee. The track is duplicated and translated -50%, which is a
 * single compositor transform for the whole strip — no per-item JavaScript.
 */
export function LogoMarquee({
  className,
  label = "Operations teams at firms like these",
  tone = "ink",
}: {
  className?: string;
  label?: string;
  tone?: "ink" | "on-ink";
}) {
  const { clients } = getShared();

  return (
    <div className={cn("group/marquee", className)}>
      {label && (
        <p className={cn(
          "mb-7 text-center font-mono text-[0.6875rem] uppercase tracking-[0.14em]",
          tone === "on-ink" ? "text-white/55" : "text-fog-2",
        )}>
          {label}
        </p>
      )}
      <div className="marquee-mask relative overflow-hidden">
        <div className="marquee-track items-center gap-12 sm:gap-16">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-12 sm:gap-16"
              aria-hidden={copy === 1}
            >
              {clients.map((client) => (
                <ClientWordmark key={`${copy}-${client.name}`} client={client} tone={tone} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
