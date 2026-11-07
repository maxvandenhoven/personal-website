import { clamp } from "./math";

/** Adds a sub-path to the context; the painter decides how to fill or stroke it. */
export type PathFn = (ctx: CanvasRenderingContext2D) => void;

type Point = readonly [number, number];

/** Trace a polygon with its corners rounded by up to `radius`. */
function roundedPolygon(
  ctx: CanvasRenderingContext2D,
  points: readonly Point[],
  radius: number,
): void {
  const n = points.length;
  const last = points[n - 1];
  const first = points[0];
  ctx.moveTo((last[0] + first[0]) / 2, (last[1] + first[1]) / 2);
  for (let k = 0; k < n; k++) {
    const a = points[(k - 1 + n) % n];
    const b = points[k];
    const c = points[(k + 1) % n];
    const ax = a[0] - b[0];
    const ay = a[1] - b[1];
    const cx = c[0] - b[0];
    const cy = c[1] - b[1];
    const l1 = Math.hypot(ax, ay);
    const l2 = Math.hypot(cx, cy);
    const cos = clamp((ax * cx + ay * cy) / (l1 * l2 || 1), -1, 1);
    const fit =
      Math.sqrt((1 - cos) / (1 + cos + 1e-9)) * Math.min(l1, l2) * 0.5;
    ctx.arcTo(b[0], b[1], c[0], c[1], Math.max(0, Math.min(radius, fit)));
  }
  ctx.closePath();
}

export const circle =
  (cx: number, cy: number, r: number): PathFn =>
  (ctx) => {
    ctx.moveTo(cx + r, cy);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  };

export const roundedRect =
  (x: number, y: number, w: number, h: number, radius: number): PathFn =>
  (ctx) => {
    const r = Math.min(radius, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

/** Pointy-top hexagon with softly rounded corners. */
export const hexagon =
  (cx: number, cy: number, r: number): PathFn =>
  (ctx) => {
    const points = Array.from({ length: 6 }, (_, k): Point => {
      const angle = (Math.PI / 180) * (60 * k - 30);
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    roundedPolygon(ctx, points, r * 0.22);
  };

/** Every figure keeps the same empty border, so the art never touches the frame. */
export function figurePadding(width: number, height: number): number {
  return Math.min(width, height) * 0.09;
}
