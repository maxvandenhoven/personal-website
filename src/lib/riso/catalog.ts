/**
 * Names of every risograph figure, kept free of DOM code so the content schema
 * (src/content.config.ts) and server-rendered components can import them.
 */

/** Large 16:9 illustrations for project and blog cards. */
export const ILLUSTRATIONS = [
  "trials",
  "hive",
  "imposter",
  "site",
  "sandboxes",
  "forecast",
] as const;

/** Small square glyphs for the skill categories. */
export const GLYPHS = [
  "languages",
  "machine-learning",
  "ai-agents",
  "infrastructure",
] as const;

export type Illustration = (typeof ILLUSTRATIONS)[number];
export type Glyph = (typeof GLYPHS)[number];
export type FigureId = Illustration | Glyph;

const FIGURE_IDS: ReadonlySet<string> = new Set([...ILLUSTRATIONS, ...GLYPHS]);

export function isFigureId(value: string): value is FigureId {
  return FIGURE_IDS.has(value);
}
