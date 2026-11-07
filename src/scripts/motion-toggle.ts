import {
  getRisoState,
  subscribeRiso,
  updateRisoState,
} from "../lib/riso/settings";

/** Play/pause buttons rendered by MotionToggle. Returns a function that detaches them. */
export function initMotionToggles(root: ParentNode = document): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  for (const button of root.querySelectorAll<HTMLButtonElement>(
    "[data-motion-toggle]",
  )) {
    const sync = ({ paused }: { paused: boolean }) => {
      const label = paused ? "Play animations" : "Pause animations";
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", label);
      button.title = label;
    };
    button.addEventListener(
      "click",
      () => updateRisoState({ paused: !getRisoState().paused }),
      { signal },
    );
    signal.addEventListener("abort", subscribeRiso(sync));
    sync(getRisoState());
  }

  return () => controller.abort();
}
