import { useEffect, useRef } from "react";

const COLORS = [
  "#FFD23F",
  "#FF6B6B",
  "#74B9FF",
  "#88D498",
  "#FFA552",
  "#B8A9FA",
];
const SPACING = 34;
const RADIUS = 2.5;
const HOVER_RADIUS = 80;
const PAINT_RADIUS = 40;
const JIGGLE = 8;
const BASE_ALPHA = 0.07;
const DECAY = 0.006;
const WAVE_SPEED = 8;

interface Dot {
  bx: number;
  by: number;
  x: number;
  y: number;
  color: string | null;
  alpha: number;
}

interface Wave {
  cx: number;
  cy: number;
  radius: number;
  width: number;
}

export function DotGrid() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    dots: [] as Dot[],
    waves: [] as Wave[],
    mx: -9999,
    my: -9999,
    down: false,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = stateRef.current;

    function rebuild() {
      const dpr = window.devicePixelRatio || 1;
      const rect = wrapper!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      state.w = w;
      state.h = h;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      const ox = (w - (cols - 1) * SPACING) / 2;
      const oy = (h - (rows - 1) * SPACING) / 2;

      state.dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = ox + c * SPACING;
          const by = oy + r * SPACING;
          state.dots.push({
            bx,
            by,
            x: bx,
            y: by,
            color: null,
            alpha: BASE_ALPHA,
          });
        }
      }
    }

    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(wrapper);

    function toLocal(e: MouseEvent): { x: number; y: number } | null {
      const rect = wrapper!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x, y };
    }

    function onMove(e: MouseEvent) {
      const p = toLocal(e);
      if (p) {
        state.mx = p.x;
        state.my = p.y;
        if (state.down) paint(p.x, p.y);
      } else {
        state.mx = -9999;
        state.my = -9999;
      }
    }

    function onDown(e: MouseEvent) {
      if (e.button !== 0) return;
      state.down = true;
      const p = toLocal(e);
      if (p) paint(p.x, p.y);
    }

    function onUp() {
      state.down = false;
    }

    function paint(mx: number, my: number) {
      const r2 = PAINT_RADIUS * PAINT_RADIUS;
      for (const d of state.dots) {
        const dx = d.bx - mx;
        const dy = d.by - my;
        if (dx * dx + dy * dy < r2) {
          d.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          d.alpha = 0.85;
        }
      }
    }

    function onWave(e: Event) {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail;
      const rect = wrapper!.getBoundingClientRect();
      state.waves.push({
        cx: detail.x - rect.left,
        cy: detail.y - rect.top,
        radius: 0,
        width: 35,
      });
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("dotgrid:wave", onWave);

    let raf = 0;
    function draw() {
      ctx!.clearRect(0, 0, state.w, state.h);

      const maxDist = Math.sqrt(state.w * state.w + state.h * state.h);
      for (const wave of state.waves) {
        wave.radius += WAVE_SPEED;
      }
      state.waves = state.waves.filter((w) => w.radius - w.width < maxDist);

      for (const d of state.dots) {
        const dx = d.bx - state.mx;
        const dy = d.by - state.my;
        const dist2 = dx * dx + dy * dy;
        const hr2 = HOVER_RADIUS * HOVER_RADIUS;

        if (dist2 < hr2 && dist2 > 0) {
          const dist = Math.sqrt(dist2);
          const factor = (1 - dist / HOVER_RADIUS) * JIGGLE;
          const tx = d.bx + (dx / dist) * factor;
          const ty = d.by + (dy / dist) * factor;
          d.x += (tx - d.x) * 0.2;
          d.y += (ty - d.y) * 0.2;
        } else {
          d.x += (d.bx - d.x) * 0.12;
          d.y += (d.by - d.y) * 0.12;
        }

        for (const wave of state.waves) {
          const wdx = d.bx - wave.cx;
          const wdy = d.by - wave.cy;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          if (wDist > wave.radius - wave.width && wDist < wave.radius) {
            d.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            d.alpha = 0.85;
          }
        }

        if (d.alpha > BASE_ALPHA + 0.005) {
          d.alpha += (BASE_ALPHA - d.alpha) * DECAY;
        } else if (d.color) {
          d.color = null;
          d.alpha = BASE_ALPHA;
        }

        ctx!.beginPath();
        ctx!.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        ctx!.globalAlpha = d.alpha;
        ctx!.fillStyle = d.color ?? "#000";
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("dotgrid:wave", onWave);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
