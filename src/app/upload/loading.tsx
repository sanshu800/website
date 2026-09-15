import { Container } from "@/components/ui/Container";

/**
 * `/upload` is the one public route that renders per request, so it is the one
 * that can leave a person waiting. The static marketing pages deliberately have
 * no loading state: they are prerendered, and a skeleton flash before content
 * that is already in the HTML is worse than no skeleton at all.
 */
export default function Loading() {
  return (
    <section className="border-b border-line bg-paper pb-20 pt-32 sm:pt-36">
      <Container width="wide">
        <span className="sr-only" role="status">
          Loading
        </span>
        <div className="h-3 w-24 animate-pulse rounded-full bg-mist-2" />
        <div className="mt-8 h-10 w-full max-w-[30rem] animate-pulse rounded-lg bg-mist-2" />
        <div className="mt-4 h-4 w-full max-w-[38rem] animate-pulse rounded-full bg-mist-2" />
        <div className="mt-10 h-64 animate-pulse rounded-2xl border border-line bg-mist" />
      </Container>
    </section>
  );
}
