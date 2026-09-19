/**
 * The admin screens read the database on every request, so they genuinely wait.
 * A quiet shape with no motion keeps the panel feeling instant rather than
 * animated.
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      <span className="sr-only" role="status">
        Loading
      </span>
      <div className="h-8 w-56 animate-pulse rounded-lg bg-mist-2" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-28 animate-pulse rounded-2xl border border-line bg-mist" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border border-line bg-mist" />
    </div>
  );
}
