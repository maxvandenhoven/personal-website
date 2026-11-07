import type { Motif } from "./motifs/types";
import { createPainter, type Painter } from "./painter";
import { readPalette } from "./palette";
import { loadFigure } from "./registry";
import { getRisoState, subscribeRiso } from "./settings";

/**
 * Drives every `<canvas data-figure="...">` on the page from one animation loop.
 * Figures only render while on screen, redraw at 20 fps (the prints move "on
 * twos" like hand-drawn animation, which also keeps the page light), and repaint
 * immediately when the print settings change.
 */

const FIGURE_SELECTOR = "canvas[data-figure]";
const MAX_DPR = 1.5;
const FRAME_INTERVAL_MS = 1000 / 20 - 2;
const MAX_STEP_SECONDS = 0.05;

interface MountedFigure {
  motif: Motif;
  clock: number;
  dirty: boolean;
  visible: boolean;
  lastDrawn: number;
}

const figures = new Map<HTMLCanvasElement, MountedFigure>();
let painter: Painter | null = null;
let observer: IntersectionObserver | null = null;
let frameRequest = 0;
let lastFrame = 0;

function invalidateAll(): void {
  for (const figure of figures.values()) figure.dirty = true;
}

function setup(): void {
  if (painter) return;
  painter = createPainter(readPalette(), getRisoState);
  subscribeRiso(invalidateAll);
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const figure = figures.get(entry.target as HTMLCanvasElement);
          if (!figure) continue;
          figure.visible = entry.isIntersecting;
          figure.dirty = true;
        }
      },
      { rootMargin: "100px" },
    );
  }
}

function renderFrame(now: number): void {
  const dt = Math.min(MAX_STEP_SECONDS, (now - lastFrame) / 1000);
  lastFrame = now;
  const { paused } = getRisoState();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  painter?.setDpr(dpr);

  for (const [canvas, figure] of figures) {
    if (!figure.visible || !painter) continue;
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (!width || !height) continue;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      figure.dirty = true;
    }
    if (!paused) figure.clock += dt;
    if (paused && !figure.dirty) continue;
    if (!figure.dirty && now - figure.lastDrawn < FRAME_INTERVAL_MS) continue;

    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    painter.begin(ctx, width, height);
    figure.motif(painter, width, height, figure.clock);
    painter.end();
    figure.dirty = false;
    figure.lastDrawn = now;
  }

  frameRequest = figures.size > 0 ? requestAnimationFrame(renderFrame) : 0;
}

/** Canvases whose artwork is still loading, so they are not mounted twice. */
const loading = new Set<HTMLCanvasElement>();

function startLoop(): void {
  if (frameRequest) return;
  lastFrame = performance.now();
  frameRequest = requestAnimationFrame(renderFrame);
}

/**
 * Start animating every figure canvas inside `root`. Canvases that are already
 * mounted are skipped. Artworks load asynchronously, so a figure starts as soon
 * as its module arrives. Returns a function that unmounts the figures again.
 */
export function mountFigures(root: ParentNode = document): () => void {
  setup();
  const mounted: HTMLCanvasElement[] = [];
  let active = true;

  for (const canvas of root.querySelectorAll<HTMLCanvasElement>(
    FIGURE_SELECTOR,
  )) {
    if (figures.has(canvas) || loading.has(canvas)) continue;
    const id = canvas.dataset.figure ?? "";
    loading.add(canvas);
    mounted.push(canvas);
    loadFigure(id)
      .then((artwork) => {
        if (!active) return;
        if (!artwork) {
          console.warn(`No artwork found for figure "${id}"`);
          return;
        }
        figures.set(canvas, {
          motif: artwork.create(),
          clock: artwork.startTime ?? 0,
          dirty: true,
          visible: true,
          lastDrawn: 0,
        });
        observer?.observe(canvas);
        startLoop();
      })
      .catch((error: unknown) =>
        console.error(`Failed to load figure "${id}"`, error),
      )
      .finally(() => loading.delete(canvas));
  }

  return () => {
    active = false;
    for (const canvas of mounted) {
      figures.delete(canvas);
      observer?.unobserve(canvas);
    }
  };
}
