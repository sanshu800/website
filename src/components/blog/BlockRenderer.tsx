import type { Block } from "@/lib/content/blog";

/**
 * Renders structured content blocks. Keeping article bodies as data means the
 * template stays a pure renderer, and the same content can later be served to
 * RSS or an email digest without re-parsing HTML.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "h2":
            return <h2 key={key}>{block.text}</h2>;
          case "h3":
            return <h3 key={key}>{block.text}</h3>;
          case "p":
            return <p key={key}>{block.text}</p>;
          case "ul":
            return (
              <ul key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={key}>
                <p>“{block.text}”</p>
                {block.attribution && (
                  <footer className="mt-2 font-sans text-[0.8125rem] not-italic text-fog">
                    — {block.attribution}
                  </footer>
                )}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={key}
                className="not-prose my-8 rounded-xl border border-violet-line bg-violet-soft p-5"
              >
                <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-violet-2">
                  {block.title}
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-violet-2">
                  {block.text}
                </p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
