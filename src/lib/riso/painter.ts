import type { PathFn } from "./geometry";
import { clamp, hash, seededRandom } from "./math";
import type { RisoPalette } from "./palette";

/**
 * Ink coverage per colour key, as [drum, tint] pairs.
 * Drum 0 is the warm ink, drum 1 the dark ink and drum 2 the light ink;
 * the tint is the halftone coverage between 0 and 1.
 */
const COVERAGE = {
  ink: [],
  dim: [[1, 0.12]],
  red: [[0, 1]],
  ember: [[0, 1]],
  orange: [
    [0, 0.75],
    [2, 0.7],
  ],
  rose: [[0, 0.4]],
  navy: [[1, 1]],
  night: [[1, 1]],
  slate: [[1, 0.7]],
  steel: [[1, 0.45]],
  cream: [[2, 0.3]],
  sun: [[2, 1]],
} satisfies Record<string, readonly (readonly [number, number])[]>;

export type InkKey = keyof typeof COVERAGE;

/** How the risograph is printed. */
export interface PrintSettings {
  /** Maximum offset between ink layers, in CSS pixels. */
  misreg: number;
  /** Strength of the ink grain and blotch textures, 0-1. */
  grain: number;
  /** Light ink tint over the whole paper, 0-1. */
  ground: number;
  /** Halftone cell size in CSS pixels (96 / pitch = lines per inch). */
  pitch: number;
  /** Whether overlapping shapes knock out the layers below or overprint them. */
  knock: "knock" | "over";
  /** Seed for the direction of the layer offsets. */
  regSeed: number;
}

/**
 * 0.5 px layer offset, 20% ink grain, 10% paper tint, knockout.
 *
 * The halftone pitch is 2 CSS px (48 lpi). Cells are never smaller than
 * MIN_SCREEN_CELL canvas pixels, so standard 1x displays get 3 px (32 lpi):
 * there the dots blur into smooth tints, while high-density displays resolve
 * each dot and need the finer screen to look the same.
 */
export const PRINT_SETTINGS: Readonly<PrintSettings> = {
  misreg: 0.5,
  grain: 0.2,
  ground: 0.1,
  pitch: 2,
  knock: "knock",
  regSeed: 3,
};

export interface PaintOptions {
  /** Overall opacity, scaling the coverage of every layer. */
  alpha?: number;
  /** Nudges coverage up or down by roughly 18% per step. */
  tone?: number;
  /** Overprint this shape even when the print settings use knockout. */
  over?: boolean;
}

export interface Painter {
  setDpr(dpr: number): void;
  begin(target: CanvasRenderingContext2D, width: number, height: number): void;
  background(key: InkKey): void;
  fill(path: PathFn, key: InkKey, options?: PaintOptions): void;
  /** Fill `path`, but only where it falls inside `clip`. */
  clipFill(
    clip: PathFn,
    path: PathFn,
    key: InkKey,
    options?: PaintOptions,
  ): void;
  stroke(
    path: PathFn,
    key: InkKey,
    width: number,
    cap?: CanvasLineCap,
    options?: PaintOptions,
  ): void;
  /** Composite the three ink layers onto the target canvas. */
  end(): void;
}

type Style = string | CanvasPattern;
type Draw = (ctx: CanvasRenderingContext2D, style: Style) => void;

/** Screen angles per drum, as on a real riso. */
const SCREEN_ANGLES = [15, 75, 45];
/**
 * Resolution of halftone tiles whose cell isn't a whole number of canvas pixels.
 * 2x keeps dots as even as on a 1x display; higher factors alias when the
 * pattern is scaled down.
 */
const SCREEN_SUPERSAMPLE = 2;
/** Smallest halftone cell, in canvas pixels, that still draws a recognisable dot. */
const MIN_SCREEN_CELL = 3;
const TEXTURE_SEED = 911;
const FIBRE_TILE = 420;
const MAX_CACHED_PAPERS = 24;

function createCanvas(size: number, height = size): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = height;
  return canvas;
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context is unavailable");
  return ctx;
}

function repeatPattern(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
): CanvasPattern {
  const pattern = ctx.createPattern(source, "repeat");
  if (!pattern) throw new Error("Could not create canvas pattern");
  return pattern;
}

interface Textures {
  grain: CanvasPattern;
  blotch: CanvasPattern;
  fibre: HTMLCanvasElement;
}

/** Ink grain, large ink blotches and paper fibres, generated once from a fixed seed. */
function createTextures(ctx: CanvasRenderingContext2D): Textures {
  const random = seededRandom(TEXTURE_SEED);

  const grainTile = createCanvas(256);
  const grainCtx = context2d(grainTile);
  const grainData = grainCtx.createImageData(256, 256);
  for (let i = 0; i < grainData.data.length; i += 4) {
    const v = random();
    grainData.data[i + 3] =
      v < 0.55 ? 0 : Math.pow((v - 0.55) / 0.45, 2.2) * 255;
  }
  grainCtx.putImageData(grainData, 0, 0);

  const speckle = createCanvas(16);
  const speckleCtx = context2d(speckle);
  const speckleData = speckleCtx.createImageData(16, 16);
  for (let i = 0; i < speckleData.data.length; i += 4) {
    speckleData.data[i + 3] = Math.pow(random(), 2.5) * 200;
  }
  speckleCtx.putImageData(speckleData, 0, 0);
  const blotchTile = createCanvas(360);
  const blotchCtx = context2d(blotchTile);
  blotchCtx.imageSmoothingQuality = "high";
  blotchCtx.drawImage(speckle, 0, 0, 360, 360);

  const fibre = createCanvas(FIBRE_TILE);
  const fibreCtx = context2d(fibre);
  fibreCtx.lineCap = "round";
  for (let i = 0; i < FIBRE_TILE; i++) {
    const px = random() * FIBRE_TILE;
    const py = random() * FIBRE_TILE;
    const len = 6 + random() * 40;
    const angle = random() * Math.PI * 2;
    const bend = (random() - 0.5) * len * 0.6;
    fibreCtx.strokeStyle =
      random() < 0.6
        ? `rgba(110,100,85,${0.015 + random() * 0.025})`
        : `rgba(255,255,250,${0.3 + random() * 0.3})`;
    fibreCtx.lineWidth = 0.4 + random() * 0.9;
    fibreCtx.beginPath();
    fibreCtx.moveTo(px, py);
    fibreCtx.quadraticCurveTo(
      px + (Math.cos(angle) * len) / 2 - Math.sin(angle) * bend,
      py + (Math.sin(angle) * len) / 2 + Math.cos(angle) * bend,
      px + Math.cos(angle) * len,
      py + Math.sin(angle) * len,
    );
    fibreCtx.stroke();
  }

  return {
    grain: repeatPattern(ctx, grainTile),
    blotch: repeatPattern(ctx, blotchTile),
    fibre,
  };
}

/**
 * Paints figures as three-ink risographs: every shape is split into screened
 * halftone layers per drum, and the layers are composited with grain and a
 * slight misregistration.
 */
export function createPainter(
  palette: RisoPalette,
  settings: Readonly<PrintSettings> = PRINT_SETTINGS,
): Painter {
  const layers = [0, 1, 2].map(() => {
    const canvas = document.createElement("canvas");
    return { canvas, ctx: context2d(canvas) };
  });
  const textures = createTextures(layers[0].ctx);
  const papers = new Map<string, HTMLCanvasElement>();
  let patterns = new Map<string, CanvasPattern>();
  let target: CanvasRenderingContext2D | null = null;
  let W = 0;
  let H = 0;
  let dpr = 1;

  function paper(): HTMLCanvasElement {
    const key = `${W}x${H}x${dpr}`;
    let canvas = papers.get(key);
    if (!canvas) {
      if (papers.size > MAX_CACHED_PAPERS) papers.clear();
      canvas = createCanvas(W, H);
      const ctx = context2d(canvas);
      ctx.fillStyle = palette.paper;
      ctx.fillRect(0, 0, W, H);
      const size = FIBRE_TILE * Math.max(1, dpr * 0.8);
      for (let ty = 0; ty < H; ty += size) {
        for (let tx = 0; tx < W; tx += size) {
          ctx.drawImage(textures.fibre, tx, ty, size, size);
        }
      }
      papers.set(key, canvas);
    }
    return canvas;
  }

  /**
   * Halftone screen for a drum at a given coverage, with a cell of exactly
   * `pitch` CSS pixels (but at least MIN_SCREEN_CELL canvas pixels). When that
   * is a whole number of canvas pixels the tile is drawn 1:1 and stays crisp;
   * otherwise it is drawn supersampled and scaled down, rather than rounded.
   */
  function screen(drum: number, tint: number): CanvasPattern {
    const q = Math.round(tint * 20) / 20;
    const period = Math.max(MIN_SCREEN_CELL, settings.pitch * dpr);
    const whole = Math.abs(period - Math.round(period)) < 0.01;
    const cell = whole
      ? Math.round(period)
      : Math.round(period * SCREEN_SUPERSAMPLE);
    const scale = period / cell;
    const key = `${drum}|${q}|${cell}|${scale}`;
    const cached = patterns.get(key);
    if (cached) return cached;

    const tile = createCanvas(cell);
    const ctx = context2d(tile);
    ctx.fillStyle = "#000";
    if (q <= 0.6) {
      ctx.beginPath();
      ctx.arc(
        cell / 2,
        cell / 2,
        cell * Math.sqrt(q / Math.PI),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, cell, cell);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(
        cell / 2,
        cell / 2,
        cell * Math.sqrt((1 - q) / Math.PI),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    const pattern = repeatPattern(layers[0].ctx, tile);
    pattern.setTransform(
      new DOMMatrix().rotate(SCREEN_ANGLES[drum]).scale(scale),
    );
    patterns.set(key, pattern);
    return pattern;
  }

  const style = (drum: number, tint: number): Style =>
    tint > 0.97 ? "#000" : screen(drum, tint);

  function coverage(key: InkKey, tone?: number) {
    const base: readonly (readonly [number, number])[] = COVERAGE[key];
    if (!tone) return base;
    return base.map(
      ([drum, tint]) =>
        [drum, clamp(tint * (1 + 0.18 * tone), 0.05, 1)] as const,
    );
  }

  function paint(
    draw: Draw,
    key: InkKey,
    options: PaintOptions = {},
    clip?: PathFn,
  ): void {
    const alpha = options.alpha ?? 1;
    const withClip = (ctx: CanvasRenderingContext2D, fn: () => void) => {
      ctx.save();
      if (clip) {
        ctx.beginPath();
        clip(ctx);
        ctx.clip();
      }
      fn();
      ctx.restore();
    };

    if (settings.knock === "knock" && !options.over) {
      for (const { ctx } of layers) {
        withClip(ctx, () => {
          ctx.globalCompositeOperation = "destination-out";
          ctx.globalAlpha = alpha;
          draw(ctx, "#000");
        });
      }
    }
    for (const [drum, tint] of coverage(key, options.tone)) {
      const t = tint * alpha;
      if (t < 0.03) continue;
      const { ctx } = layers[drum];
      withClip(ctx, () => draw(ctx, style(drum, t)));
    }
  }

  const fillShape =
    (path: PathFn): Draw =>
    (ctx, st) => {
      ctx.fillStyle = st;
      ctx.beginPath();
      path(ctx);
      ctx.fill();
    };

  return {
    setDpr(next) {
      if (next !== dpr) {
        dpr = next;
        patterns = new Map();
      }
    },

    begin(ctx, width, height) {
      target = ctx;
      W = width;
      H = height;
      for (const layer of layers) {
        if (layer.canvas.width < width || layer.canvas.height < height) {
          layer.canvas.width = Math.max(layer.canvas.width, width);
          layer.canvas.height = Math.max(layer.canvas.height, height);
        }
        layer.ctx.setTransform(1, 0, 0, 1, 0, 0);
        layer.ctx.globalAlpha = 1;
        layer.ctx.globalCompositeOperation = "source-over";
        layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
      }
      const { ground } = settings;
      if (ground > 0.01) {
        layers[2].ctx.fillStyle = screen(2, ground);
        layers[2].ctx.fillRect(0, 0, W, H);
      }
    },

    background(key) {
      for (const [drum, tint] of COVERAGE[key] as readonly (readonly [
        number,
        number,
      ])[]) {
        layers[drum].ctx.fillStyle = style(drum, tint);
        layers[drum].ctx.fillRect(0, 0, W, H);
      }
    },

    fill(path, key, options) {
      paint(fillShape(path), key, options);
    },

    clipFill(clip, path, key, options) {
      paint(fillShape(path), key, options, clip);
    },

    stroke(path, key, width, cap = "round", options) {
      paint(
        (ctx, st) => {
          ctx.lineWidth = width;
          ctx.lineCap = cap;
          ctx.strokeStyle = st;
          ctx.beginPath();
          path(ctx);
          ctx.stroke();
        },
        key,
        options,
      );
    },

    end() {
      if (!target) return;
      const x = target;
      const { grain, misreg, regSeed } = settings;
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.globalCompositeOperation = "source-over";
      x.globalAlpha = 1;
      x.drawImage(paper(), 0, 0);

      layers.forEach(({ canvas, ctx }, i) => {
        // Colour the layer with its ink, then eat into it with grain and blotches.
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = palette.inks[i];
        ctx.fillRect(0, 0, W, H);
        if (grain > 0) {
          ctx.globalCompositeOperation = "destination-out";
          textures.grain.setTransform(
            new DOMMatrix().translate(i * 71, i * 37),
          );
          ctx.globalAlpha = grain;
          ctx.fillStyle = textures.grain;
          ctx.fillRect(0, 0, W, H);
          textures.blotch.setTransform(
            new DOMMatrix().translate(i * 131, i * 89).scale(dpr),
          );
          ctx.globalAlpha = grain * 0.6;
          ctx.fillStyle = textures.blotch;
          ctx.fillRect(0, 0, W, H);
          ctx.globalAlpha = 1;
        }
        ctx.globalCompositeOperation = "source-over";

        // The first drum is the registration reference; the others drift slightly.
        let dx = 0;
        let dy = 0;
        let rotation = 0;
        if (i > 0) {
          const angle = hash(regSeed, i, 7) * Math.PI * 2;
          const offset = misreg * dpr * (0.6 + 0.4 * hash(regSeed, i, 9));
          dx = Math.cos(angle) * offset;
          dy = Math.sin(angle) * offset;
          rotation = (hash(regSeed, i, 3) - 0.5) * misreg * 0.0012;
        }
        x.globalCompositeOperation = "multiply";
        x.globalAlpha = 0.95;
        x.save();
        x.translate(W / 2 + dx, H / 2 + dy);
        x.rotate(rotation);
        x.drawImage(canvas, 0, 0, W, H, -W / 2, -H / 2, W, H);
        x.restore();
      });
      x.globalCompositeOperation = "source-over";
      x.globalAlpha = 1;
    },
  };
}
