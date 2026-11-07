import { readPalette } from "./palette";
import { isPaused, subscribePaused } from "./motion";

/**
 * Page background: a faint dot grid that warms up near the pointer, drawn on a
 * fixed full-viewport canvas. Only redraws when the pointer, scroll position or
 * viewport changes.
 */

const SPACING = 28;
const DOT_RADIUS = 1.1;
const GLOW_RADIUS = 170;
const POINTER_EASING = 0.12;
const MAX_DPR = 2;
const OFFSCREEN = -999;

export function startBackground(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const [warm, dark] = readPalette().inks;
  const pointer = { x: OFFSCREEN, y: OFFSCREEN };
  const target = { x: OFFSCREEN, y: OFFSCREEN };
  let dirty = true;
  const invalidate = () => {
    dirty = true;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      // Jump straight to the first known position instead of sliding in from offscreen.
      if (pointer.x <= OFFSCREEN) {
        pointer.x = target.x;
        pointer.y = target.y;
      }
      dirty = true;
    },
    { passive: true },
  );
  window.addEventListener("resize", invalidate);
  window.addEventListener("scroll", invalidate, { passive: true });
  subscribePaused(invalidate);

  function draw(): void {
    if (Math.abs(target.x - pointer.x) + Math.abs(target.y - pointer.y) > 0.5) {
      const k = isPaused() ? 1 : POINTER_EASING;
      pointer.x += (target.x - pointer.x) * k;
      pointer.y += (target.y - pointer.y) * k;
      dirty = true;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (
      canvas.width !== Math.round(W * dpr) ||
      canvas.height !== Math.round(H * dpr)
    ) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      dirty = true;
    }

    if (dirty && ctx) {
      dirty = false;
      // Dots near the pointer fall into three brightness bands.
      const base = new Path2D();
      const lit = [new Path2D(), new Path2D(), new Path2D()];
      const offsetY = -(window.scrollY % SPACING);
      for (let y = offsetY + SPACING / 2; y < H + SPACING; y += SPACING) {
        for (let x = (W % SPACING) / 2; x < W; x += SPACING) {
          const d = Math.hypot(x - pointer.x, y - pointer.y) / GLOW_RADIUS;
          if (d < 1) {
            const band = Math.min(2, Math.floor((1 - d) * 3));
            const r = DOT_RADIUS * (2 - d);
            lit[band].moveTo(x + r, y);
            lit[band].arc(x, y, r, 0, Math.PI * 2);
          } else {
            base.moveTo(x + DOT_RADIUS, y);
            base.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          }
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = dark;
      ctx.globalAlpha = 0.09;
      ctx.fill(base);
      ctx.fillStyle = warm;
      lit.forEach((path, i) => {
        ctx.globalAlpha = 0.16 + 0.14 * i;
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
