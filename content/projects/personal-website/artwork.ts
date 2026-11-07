import { defineArtwork } from "@/lib/riso/artwork";
import { circle, roundedRect } from "@/lib/riso/geometry";
import { clamp, ease, hash } from "@/lib/riso/math";
import type { InkKey } from "@/lib/riso/painter";
import { drawEclipse } from "@/lib/riso/motifs/eclipse";
import type { Motif } from "@/lib/riso/motifs/types";

interface SiteOptions {
  speed: number;
}

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Source file the block is built from. */
  file: number;
  /** Static blocks have a colour; islands come alive after hydration instead. */
  color?: InkKey;
  island?: 0 | 1 | 2;
}

const CYCLE = 11;
const HYDRATE_AT = 5.2;

/**
 * This website: Markdown files are built block by block into a static page,
 * and then only a few islands on the page come alive.
 */
function site({ speed }: SiteOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");
    const phase = (t * speed) % CYCLE;
    const u = H / 20;
    const lineWidth = Math.max(1, u * 0.12);
    const fade = 1 - ease(clamp((phase - 10.2) / 0.8, 0, 1));
    const hydrated = clamp((phase - HYDRATE_AT) / 0.6, 0, 1);

    // Source: three Markdown files, frontmatter in orange.
    const sx = W * 0.05;
    const sw = W * 0.27;
    const fh = H * 0.24;
    const fg = H * 0.05;
    const sy0 = (H - (3 * fh + 2 * fg)) / 2;
    const fileY = (f: number) => sy0 + f * (fh + fg);

    // The page: a browser window.
    const px = W * 0.43;
    const py = H * 0.08;
    const pw = W * 0.52;
    const ph = H * 0.84;
    const ix = px + pw * 0.07;
    const iw = pw * 0.86;
    const top = py + u * 2.1;
    const cy = top + u * 7.4;
    const ch = py + ph - u * 1 - cy;
    const cg = iw * 0.04;
    const cw = (iw - 2 * cg) / 3;
    const blocks: Block[] = [
      { x: ix, y: top, w: iw, h: u * 0.7, color: "slate", file: 0 },
      {
        x: ix,
        y: top + u * 1.6,
        w: iw * 0.5,
        h: u * 1.15,
        color: "cream",
        file: 0,
      },
      {
        x: ix,
        y: top + u * 3.1,
        w: iw * 0.36,
        h: u * 1.15,
        color: "cream",
        file: 0,
      },
      {
        x: ix,
        y: top + u * 4.9,
        w: iw * 0.46,
        h: u * 0.45,
        color: "steel",
        file: 0,
      },
      {
        x: ix,
        y: top + u * 5.7,
        w: iw * 0.38,
        h: u * 0.45,
        color: "steel",
        file: 0,
      },
      {
        x: ix + iw * 0.58,
        y: top + u * 1.6,
        w: iw * 0.42,
        h: u * 4.6,
        island: 0,
        file: 1,
      },
      { x: ix, y: cy, w: cw, h: ch, color: "navy", file: 2 },
      { x: ix + cw + cg, y: cy, w: cw, h: ch, island: 1, file: 2 },
      { x: ix + 2 * (cw + cg), y: cy, w: cw, h: ch, island: 2, file: 2 },
    ];
    const startOf = (i: number) => 0.4 + i * 0.5;
    const active = blocks.findIndex(
      (_, i) => phase >= startOf(i) && phase < startOf(i) + 0.5,
    );

    for (let f = 0; f < 3; f++) {
      const y = fileY(f);
      P.fill(roundedRect(sx, y, sw, fh, u * 0.6), "navy");
      for (let b = 0; b < 5; b++) {
        P.fill(
          roundedRect(
            sx + sw * 0.1,
            y + fh * 0.15 + b * fh * 0.15,
            sw * (b === 0 ? 0.3 : 0.45 + 0.35 * hash(f, b, 4)),
            fh * 0.075,
            fh * 0.04,
          ),
          b === 0 ? "orange" : "steel",
        );
      }
      if (active >= 0 && blocks[active].file === f) {
        P.stroke(roundedRect(sx, y, sw, fh, u * 0.6), "cream", lineWidth);
      }
    }
    P.fill(roundedRect(px, py, pw, ph, u * 0.7), "dim");
    (["red", "orange", "steel"] as const).forEach((key, i) =>
      P.fill(circle(px + u * (1 + i * 0.9), py + u * 0.95, u * 0.27), key),
    );

    // Build: each block is sent from its file and lands on the page.
    blocks.forEach((b, i) => {
      const grow = ease(clamp((phase - startOf(i) - 0.35) / 0.3, 0, 1)) * fade;
      if (grow <= 0.02) return;
      const radius = Math.min(u * 0.4, b.h / 2);
      const outline = roundedRect(b.x, b.y, b.w, b.h, radius);
      if (b.island === undefined) {
        P.fill(
          roundedRect(b.x, b.y, b.w * grow, b.h, radius),
          b.color ?? "cream",
          { alpha: fade },
        );
        return;
      }
      if (hydrated <= 0) {
        P.stroke(outline, "slate", lineWidth, "round", { alpha: fade });
        return;
      }

      const alpha = fade * hydrated;
      P.fill(outline, "navy", { alpha });
      const cx = b.x + b.w / 2;
      const cyy = b.y + b.h / 2;
      const m = Math.min(b.w, b.h);
      const tt = t - HYDRATE_AT;
      if (b.island === 0) {
        const r = m * 0.3;
        drawEclipse(
          P,
          cx,
          cyy,
          r,
          r * (1.05 + 0.95 * Math.sin(tt * 1.3)),
          alpha,
        );
      } else if (b.island === 1) {
        for (let j = 0; j < 4; j++) {
          const bw = b.w * 0.14;
          const h =
            b.h *
            0.55 *
            (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(tt * 1.6 + j * 1.1)));
          P.fill(
            roundedRect(
              b.x + b.w * (0.15 + j * 0.19),
              b.y + b.h * 0.8 - h,
              bw,
              h,
              bw / 2,
            ),
            j === 3 ? "slate" : "orange",
            {
              alpha,
            },
          );
        }
      } else {
        (["cream", "orange", "steel"] as const).forEach((key, j) => {
          const r = m * 0.1;
          const ax = b.w / 2 - r * 1.6;
          const ay = b.h / 2 - r * 1.6;
          P.clipFill(
            outline,
            circle(
              cx + Math.sin(tt * (0.9 + j * 0.3) + j * 2) * ax,
              cyy + Math.cos(tt * (0.7 + j * 0.4) + j) * ay,
              r,
            ),
            key,
            { alpha },
          );
        });
      }
      if (hydrated < 1)
        P.stroke(outline, "orange", lineWidth * 2, "round", {
          alpha: 1 - hydrated,
        });
    });

    // A packet in flight from the active file to its block.
    if (active >= 0) {
      const b = blocks[active];
      const k = clamp((phase - startOf(active)) / 0.4, 0, 1);
      const e = ease(k);
      const ax = sx + sw;
      const ay = fileY(b.file) + fh / 2;
      const bx = b.x + Math.min(b.w, u * 2) / 2;
      const by = b.y + b.h / 2;
      if (k < 1)
        P.fill(
          circle(
            ax + (bx - ax) * e,
            ay + (by - ay) * e - Math.sin(e * Math.PI) * u * 1.5,
            u * 0.3,
          ),
          "orange",
        );
    }
  };
}

export default defineArtwork({ create: () => site({ speed: 1 }) });
