import {
  DEFAULT_PRINT_SETTINGS,
  OVERLAP_OPTIONS,
  RANGE_CONTROLS,
} from "../../lib/riso/settings";
import { Icon } from "../ui/Icon";
import { Pill } from "../ui/Pill";

const SHEET_ID = "print-settings";

/** Three overlapping ink dots, as on the riso drums. */
function InkSwatch() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5" cy="5" r="3.2" className="fill-brand-red" />
      <circle
        cx="11"
        cy="5"
        r="3.2"
        className="fill-swatch-slate mix-blend-multiply"
      />
      <circle
        cx="8"
        cy="10.5"
        r="3.2"
        className="fill-swatch-sun mix-blend-multiply"
      />
    </svg>
  );
}

/**
 * Floating "Print settings" button and sheet for tuning the risograph effect.
 * Rendered with the default settings; src/scripts/print-settings.ts restores
 * saved settings and wires up the controls.
 */
export function PrintSettings() {
  return (
    <div
      data-print-settings=""
      className="fixed right-[max(16px,calc(env(safe-area-inset-right,0px)+16px))] bottom-[max(16px,calc(env(safe-area-inset-bottom,0px)+16px))] z-30 flex flex-col items-end gap-2.5"
    >
      <div
        id={SHEET_ID}
        role="dialog"
        aria-label="Print settings"
        hidden
        data-sheet=""
        className="rounded-card border-rule bg-card shadow-sheet flex max-h-[min(78vh,720px)] w-[min(340px,calc(100vw-32px))] flex-col gap-4.5 overflow-auto border p-4.5"
      >
        <div className="flex items-center justify-between">
          <strong className="text-md">Print settings</strong>
          <button
            type="button"
            data-close=""
            aria-label="Close settings"
            className="border-rule text-ink grid size-9 cursor-pointer place-items-center rounded-full border"
          >
            <Icon name="close" size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {RANGE_CONTROLS.map(({ key, label, min, max, step, format }) => (
            <div
              key={key}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-2 gap-y-1.5"
            >
              <label htmlFor={`riso-${key}`} className="text-sm font-medium">
                {label}
              </label>
              <output
                htmlFor={`riso-${key}`}
                data-output={key}
                className="text-2xs font-mono leading-none tabular-nums"
              >
                {format(DEFAULT_PRINT_SETTINGS[key])}
              </output>
              <input
                type="range"
                id={`riso-${key}`}
                data-range={key}
                min={min}
                max={max}
                step={step}
                defaultValue={DEFAULT_PRINT_SETTINGS[key]}
                className="range-input col-span-full"
              />
            </div>
          ))}
          <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-2 gap-y-1.5">
            <span id="riso-overlap-label" className="text-sm font-medium">
              Overlapping shapes
            </span>
            <div
              role="radiogroup"
              aria-labelledby="riso-overlap-label"
              className="col-span-full grid grid-cols-2 gap-[5px]"
            >
              {OVERLAP_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  data-overlap={value}
                  aria-checked={value === DEFAULT_PRINT_SETTINGS.knock}
                  className="rounded-control border-rule text-ink aria-checked:border-ink aria-checked:bg-ink aria-checked:text-paper cursor-pointer border px-1.5 py-2.5 text-xs leading-none font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            data-shuffle=""
            className="rounded-control bg-ink text-paper min-h-10 cursor-pointer text-sm leading-none font-medium"
          >
            Shuffle layer offsets
          </button>
          <p className="text-muted text-xs">
            The illustrations mimic risograph printing with three ink layers,
            halftone dots and small offsets between the layers. Adjust the
            settings to change the effect.
          </p>
        </div>
      </div>
      <Pill
        data-open=""
        aria-expanded={false}
        aria-controls={SHEET_ID}
        className="shadow-float min-h-11"
      >
        <InkSwatch />
        Print settings
      </Pill>
    </div>
  );
}
