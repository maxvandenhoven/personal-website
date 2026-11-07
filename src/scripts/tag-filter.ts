import { pluralize } from "../lib/format";

function parseTags(element: HTMLElement): string[] {
  try {
    const tags: unknown = JSON.parse(element.dataset.tags ?? "[]");
    return Array.isArray(tags)
      ? tags.filter((tag) => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

/** Single-select topic filters rendered by FilterableList. Returns a function that detaches them. */
export function initTagFilters(root: ParentNode = document): () => void {
  const controller = new AbortController();
  for (const list of root.querySelectorAll<HTMLElement>("[data-tag-filter]")) {
    const buttons = [
      ...list.querySelectorAll<HTMLButtonElement>("button[data-tag]"),
    ];
    const items = [...list.querySelectorAll<HTMLElement>("[data-tags]")].map(
      (element) => ({
        element,
        tags: parseTags(element),
      }),
    );
    const count = list.querySelector<HTMLElement>("[data-filter-count]");
    const empty = list.querySelector<HTMLElement>("[data-filter-empty]");
    const singular = list.dataset.nounSingular ?? "item";
    const plural = list.dataset.nounPlural ?? "items";

    const apply = (tag: string) => {
      let shown = 0;
      for (const { element, tags } of items) {
        const visible = tag === "" || tags.includes(tag);
        element.hidden = !visible;
        if (visible) shown++;
      }
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(button.dataset.tag === tag));
      }
      if (count) count.textContent = pluralize(shown, singular, plural);
      if (empty) empty.hidden = shown > 0;
    };

    for (const button of buttons) {
      button.addEventListener("click", () => apply(button.dataset.tag ?? ""), {
        signal: controller.signal,
      });
    }
  }
  return () => controller.abort();
}
