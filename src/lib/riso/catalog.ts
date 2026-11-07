/**
 * Figure IDs. Kept free of DOM code so the content schema and server-rendered
 * components can import them.
 *
 * - Glyphs are the small square figures for the homepage skill categories.
 * - Artworks belong to a blog post or project and are identified by
 *   "<collection>/<slug>", e.g. "projects/hive" (see registry.ts).
 */

export const GLYPHS = [
  "languages",
  "machine-learning",
  "ai-agents",
  "infrastructure",
] as const;

export type Glyph = (typeof GLYPHS)[number];

export function isGlyph(value: string): value is Glyph {
  return (GLYPHS as readonly string[]).includes(value);
}
