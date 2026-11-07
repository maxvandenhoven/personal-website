/**
 * Whether animations are paused, shared by the figure renderer, the page
 * background and the play/pause button. Starts paused when the visitor prefers
 * reduced motion.
 *
 * Safe to import on the server: nothing touches `window` until it is read.
 */

type Listener = (paused: boolean) => void;

let paused: boolean | null = null;
const listeners = new Set<Listener>();

export function isPaused(): boolean {
  paused ??= window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return paused;
}

export function setPaused(value: boolean): void {
  paused = value;
  for (const listener of listeners) listener(value);
}

export function subscribePaused(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
