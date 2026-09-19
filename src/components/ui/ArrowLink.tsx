import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

/**
 * A link that goes somewhere, with an arrow that says "onwards".
 *
 * This pattern had been reimplemented inline at a dozen call sites, and the
 * copies had drifted: two different sizes (14px and 15px), two tones, arrows at
 * two different icon sizes, and a `group` class on some but not others, so
 * whether the arrow moved on hover depended on which copy you happened to be
 * looking at. Those near-duplicates are what made the page look like it had more
 * button styles than it does — see the ArrowLink usages rather than the class
 * string.
 *
 * The arrow is `aria-hidden`: it repeats what the link text already says, and a
 * screen reader announcing it adds nothing.
 *
 * For an action that is the point of its section, use `ButtonLink` instead —
 * this is for the secondary "read more about X" path.
 */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** `dark` for use on a night surface. */
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-body font-medium",
        tone === "dark" ? "text-accent-3" : "text-accent",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
