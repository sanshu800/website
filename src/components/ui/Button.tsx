import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-violet text-white shadow-[0_1px_2px_rgba(11,11,16,0.12)] hover:bg-violet-2 hover:shadow-violet active:translate-y-px",
  secondary:
    "border border-line-strong bg-paper text-ink hover:border-ink/25 hover:bg-mist active:translate-y-px",
  ghost: "text-fg-2 hover:bg-mist hover:text-ink",
  inverse:
    "bg-paper text-ink hover:bg-mist-2 active:translate-y-px border border-transparent",
  danger:
    "bg-danger text-white hover:brightness-95 active:translate-y-px shadow-xs",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[0.8125rem]",
  md: "h-10 px-4.5 text-[0.875rem]",
  lg: "h-12 px-6 text-[0.9375rem]",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  full?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  iconRight,
  full,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  iconRight,
  full,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  const classes = cn(base, variants[variant], sizes[size], full && "w-full", className);
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {icon}
        {children}
        {iconRight}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
