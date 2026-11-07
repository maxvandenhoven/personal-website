/** Matches the md breakpoint in global.css, where the inline links return. */
const WIDE_SCREEN = "(width >= 900px)";

/**
 * The narrow-screen menu rendered by NavMenu. Opens on click; closes on a
 * second click, Escape, a click outside, or when the screen widens enough for
 * the inline links. Returns a function that detaches it.
 */
export function initNavMenus(root: ParentNode = document): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  for (const menu of root.querySelectorAll<HTMLElement>("[data-nav-menu]")) {
    const button = menu.querySelector<HTMLButtonElement>(
      "[data-nav-menu-toggle]",
    );
    const panelId = button?.getAttribute("aria-controls");
    const panel = panelId
      ? menu.querySelector<HTMLElement>(`#${panelId}`)
      : null;
    if (!button || !panel) continue;

    const setOpen = (open: boolean) => {
      const label = open ? "Close menu" : "Open menu";
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", label);
      button.title = label;
    };
    const isOpen = () => !panel.hidden;

    button.addEventListener("click", () => setOpen(!isOpen()), { signal });
    menu.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && isOpen()) {
          setOpen(false);
          button.focus();
        }
      },
      { signal },
    );
    document.addEventListener(
      "click",
      (event) => {
        if (isOpen() && !menu.contains(event.target as Node)) setOpen(false);
      },
      { signal },
    );
    window.matchMedia(WIDE_SCREEN).addEventListener(
      "change",
      (event) => {
        if (event.matches) setOpen(false);
      },
      { signal },
    );
  }

  return () => controller.abort();
}
