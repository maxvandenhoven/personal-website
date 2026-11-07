import type { Artwork } from "./artwork";

/**
 * Maps figure IDs ("<collection>/<slug>") to artworks. Artworks are found by convention at
 * content/<collection>/<slug>/artwork.ts and loaded lazily, so a page only
 * downloads the artworks it shows.
 */

type ArtworkModule = { default: Artwork };

const modules = import.meta.glob<ArtworkModule>(
  "../../../content/*/*/artwork.ts",
);
const ARTWORK_PATH = /content\/([^/]+)\/([^/]+)\/artwork\.ts$/;

const loaders = new Map<string, () => Promise<ArtworkModule>>();
for (const [path, load] of Object.entries(modules)) {
  const match = ARTWORK_PATH.exec(path);
  if (match) loaders.set(artworkId(match[1], match[2]), load);
}

/** Figure ID of the artwork for a content entry, e.g. "projects/hive". */
export function artworkId(collection: string, slug: string): string {
  return `${collection}/${slug}`;
}

/** IDs of every artwork in content/, including drafts. */
export const ARTWORK_IDS: readonly string[] = [...loaders.keys()].sort();

export function hasArtwork(id: string): boolean {
  return loaders.has(id);
}

/** Resolve a figure ID to its artwork, or undefined if there is none. */
export async function loadFigure(id: string): Promise<Artwork | undefined> {
  const load = loaders.get(id);
  return load ? (await load()).default : undefined;
}
