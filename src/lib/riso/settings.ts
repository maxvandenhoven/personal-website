/**
 * Print settings for the risograph figures, plus the play/pause state.
 *
 * A tiny observable store shared by the renderer and the UI controllers. Print
 * settings persist in localStorage; the paused state does not (it starts paused
 * when the visitor prefers reduced motion).
 *
 * Safe to import on the server: nothing touches `window` until the state is read.
 */

export type OverlapMode = "knock" | "over";

export interface PrintSettings {
  /** Maximum offset between ink layers, in CSS pixels. */
  misreg: number;
  /** Strength of the ink grain and blotch textures, 0-1. */
  grain: number;
  /** Light ink tint over the whole paper, 0-1. */
  ground: number;
  /** Halftone cell size in CSS pixels (lower is denser). */
  pitch: number;
  /** Whether overlapping shapes knock out the layers below or overprint them. */
  knock: OverlapMode;
  /** Seed for the direction of the layer offsets. */
  regSeed: number;
}

export interface RisoState extends PrintSettings {
  paused: boolean;
}

export type RangeSettingKey = "misreg" | "grain" | "ground" | "pitch";

export interface RangeControl {
  key: RangeSettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

export interface OverlapOption {
  value: OverlapMode;
  label: string;
}

/* 0.5 px layer offset, 20% ink grain, 10% paper tint, 30 lpi, knockout */
export const DEFAULT_PRINT_SETTINGS: Readonly<PrintSettings> = {
  misreg: 0.5,
  grain: 0.2,
  ground: 0.1,
  pitch: 3.25,
  knock: "knock",
  regSeed: 3,
};

const percent = (value: number) => `${Math.round(value * 100)}%`;

export const RANGE_CONTROLS: readonly RangeControl[] = [
  {
    key: "misreg",
    label: "Layer offset",
    min: 0,
    max: 6,
    step: 0.1,
    format: (value) => `${value.toFixed(1)} px`,
  },
  {
    key: "grain",
    label: "Ink grain",
    min: 0,
    max: 1,
    step: 0.01,
    format: percent,
  },
  {
    key: "ground",
    label: "Paper tint",
    min: 0,
    max: 0.5,
    step: 0.01,
    format: percent,
  },
  {
    key: "pitch",
    label: "Halftone density",
    min: 2,
    max: 9,
    step: 0.25,
    // 96 CSS px per inch, so the cell size maps to lines per inch
    format: (value) => `${Math.round(96 / value)} lpi`,
  },
];

export const OVERLAP_OPTIONS: readonly OverlapOption[] = [
  { value: "knock", label: "Knockout" },
  { value: "over", label: "Overprint" },
];

const STORAGE_KEY = "mvdh-riso-v2";

type Listener = (state: Readonly<RisoState>) => void;

let state: RisoState | null = null;
const listeners = new Set<Listener>();

function loadSettings(): PrintSettings {
  const settings = { ...DEFAULT_PRINT_SETTINGS };
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "{}",
    );
    if (typeof saved !== "object" || saved === null) return settings;
    const record = saved as Record<string, unknown>;
    for (const { key, min, max } of RANGE_CONTROLS) {
      const value = record[key];
      if (typeof value === "number" && value >= min && value <= max) {
        settings[key] = value;
      }
    }
    if (OVERLAP_OPTIONS.some((option) => option.value === record.knock)) {
      settings.knock = record.knock as OverlapMode;
    }
    if (typeof record.regSeed === "number") settings.regSeed = record.regSeed;
  } catch {
    // Unavailable or corrupt storage: fall back to the defaults.
  }
  return settings;
}

function saveSettings({ paused: _paused, ...settings }: RisoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable (private mode, quota); settings stay in memory.
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getRisoState(): Readonly<RisoState> {
  state ??= { ...loadSettings(), paused: prefersReducedMotion() };
  return state;
}

export function updateRisoState(patch: Partial<RisoState>): void {
  const next = { ...getRisoState(), ...patch };
  state = next;
  if (Object.keys(patch).some((key) => key !== "paused")) saveSettings(next);
  for (const listener of listeners) listener(next);
}

export function subscribeRiso(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Pick a new, deterministic direction for the layer offsets. */
export function shuffleRegistration(): void {
  updateRisoState({ regSeed: (getRisoState().regSeed * 17 + 5) % 9973 });
}
