/**
 * Renders structured data.
 *
 * `<` is escaped because a JSON string containing `</script>` would otherwise
 * close the tag early — the one real injection risk in server-rendered JSON-LD.
 * Everything here is server-generated from our own content documents, so this is
 * belt and braces rather than a live concern.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
