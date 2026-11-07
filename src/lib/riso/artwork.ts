import type { Motif } from "./motifs/types";

/**
 * An animated illustration. Each skill, blog post and project keeps its own in
 * `content/<collection>/<slug>/artwork.ts`, default-exporting `defineArtwork(...)`.
 */
export interface Artwork {
  /** Creates a fresh motif, so per-canvas state is never shared. */
  create: () => Motif;
  /** Clock offset in seconds, so the first frame already shows something. */
  startTime?: number;
}

/** Identity helper that gives artwork modules type checking. */
export function defineArtwork(artwork: Artwork): Artwork {
  return artwork;
}
