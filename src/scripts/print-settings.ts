import {
  getRisoState,
  RANGE_CONTROLS,
  shuffleRegistration,
  subscribeRiso,
  updateRisoState,
  type OverlapMode,
  type PrintSettings,
} from "../lib/riso/settings";

/** The print settings dock rendered by PrintSettings. Returns a function that detaches it. */
export function initPrintSettings(root: ParentNode = document): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const dock = root.querySelector<HTMLElement>("[data-print-settings]");
  const sheet = dock?.querySelector<HTMLElement>("[data-sheet]");
  const openButton = dock?.querySelector<HTMLButtonElement>("[data-open]");
  if (!dock || !sheet || !openButton) return () => controller.abort();

  const setOpen = (open: boolean) => {
    sheet.hidden = !open;
    openButton.setAttribute("aria-expanded", String(open));
  };
  const close = () => {
    setOpen(false);
    openButton.focus();
  };
  openButton.addEventListener("click", () => setOpen(Boolean(sheet.hidden)), {
    signal,
  });
  dock
    .querySelector("[data-close]")
    ?.addEventListener("click", close, { signal });
  sheet.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") close();
    },
    { signal },
  );

  const ranges = RANGE_CONTROLS.flatMap((control) => {
    const input = dock.querySelector<HTMLInputElement>(
      `[data-range="${control.key}"]`,
    );
    const output = dock.querySelector<HTMLOutputElement>(
      `[data-output="${control.key}"]`,
    );
    if (!input || !output) return [];
    input.addEventListener(
      "input",
      () => updateRisoState({ [control.key]: input.valueAsNumber }),
      { signal },
    );
    return [{ control, input, output }];
  });

  const overlapButtons = [
    ...dock.querySelectorAll<HTMLButtonElement>("[data-overlap]"),
  ];
  for (const button of overlapButtons) {
    button.addEventListener(
      "click",
      () => updateRisoState({ knock: button.dataset.overlap as OverlapMode }),
      { signal },
    );
  }

  dock
    .querySelector("[data-shuffle]")
    ?.addEventListener("click", shuffleRegistration, {
      signal,
    });

  const render = (settings: Readonly<PrintSettings>) => {
    for (const { control, input, output } of ranges) {
      const value = settings[control.key];
      input.value = String(value);
      output.textContent = control.format(value);
      const fill = ((value - control.min) / (control.max - control.min)) * 100;
      input.style.setProperty("--fill", `${fill}%`);
    }
    for (const button of overlapButtons) {
      button.setAttribute(
        "aria-checked",
        String(button.dataset.overlap === settings.knock),
      );
    }
  };
  signal.addEventListener("abort", subscribeRiso(render));
  render(getRisoState());

  return () => controller.abort();
}
