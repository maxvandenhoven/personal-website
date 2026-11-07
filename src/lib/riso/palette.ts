/**
 * The three riso inks and the paper colour, read from the design tokens in
 * src/styles/global.css so the canvas and the page share one source of truth.
 *
 * Drum 0 is the warm ink, drum 1 the dark ink and drum 2 the light ink.
 */
export interface RisoPalette {
  inks: readonly [string, string, string];
  paper: string;
}

const TOKENS = {
  warm: "--color-riso-warm",
  dark: "--color-riso-dark",
  light: "--color-riso-light",
  paper: "--color-art",
} as const;

let cached: RisoPalette | null = null;

export function readPalette(): RisoPalette {
  if (cached) return cached;
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => {
    const value = style.getPropertyValue(name).trim();
    if (!value) throw new Error(`Missing design token ${name}`);
    return value;
  };
  cached = {
    inks: [read(TOKENS.warm), read(TOKENS.dark), read(TOKENS.light)],
    paper: read(TOKENS.paper),
  };
  return cached;
}
