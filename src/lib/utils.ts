export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(value >= 100_000 ? 0 : 1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string | Date, style: "short" | "long" = "short"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(date);
}

export function relativeTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 1) return "just now";
  if (Math.abs(minutes) < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 31) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

/** Days until a date; negative when overdue. */
export function daysUntil(value: string | Date): number {
  const date = typeof value === "string" ? new Date(value) : value;
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => /[a-zA-Z]/.test(part[0] ?? ""))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/** Clamp a page number into a range. */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), totalPages);
}
