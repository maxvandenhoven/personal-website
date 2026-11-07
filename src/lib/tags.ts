/** All tags across items, de-duplicated and sorted alphabetically. */
export function collectTags(
  items: readonly { tags: readonly string[] }[],
): string[] {
  return [...new Set(items.flatMap((item) => item.tags))].sort((a, b) =>
    a.localeCompare(b),
  );
}
