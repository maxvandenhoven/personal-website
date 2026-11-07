import { isPaused, setPaused, subscribePaused } from "../lib/riso/motion";

/** Play/pause buttons rendered by MotionToggle. Returns a function that detaches them. */
export function initMotionToggles(root: ParentNode = document): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  for (const button of root.querySelectorAll<HTMLButtonElement>(
    "[data-motion-toggle]",
  )) {
    const sync = (paused: boolean) => {
      const label = paused ? "Play animations" : "Pause animations";
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", label);
      button.title = label;
    };
    button.addEventListener("click", () => setPaused(!isPaused()), { signal });
    signal.addEventListener("abort", subscribePaused(sync));
    sync(isPaused());
  }

  return () => controller.abort();
}
