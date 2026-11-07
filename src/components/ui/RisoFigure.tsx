import { ArtFrame } from "./ArtFrame";

interface RisoFigureProps {
  /** A glyph name or an artwork ID such as "projects/hive". */
  figure: string;
  /** Description for screen readers; omit for purely decorative figures. */
  label?: string;
  /** Size, aspect ratio and corner radius of the frame. */
  className?: string;
}

/**
 * An animated risograph figure. Renders an empty canvas; the riso engine
 * (src/lib/riso/engine.ts) finds it by its `data-figure` attribute, loads the
 * matching artwork and paints it.
 */
export function RisoFigure({ figure, label, className }: RisoFigureProps) {
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true as const };
  return (
    <ArtFrame className={className}>
      <canvas data-figure={figure} className="block size-full" {...a11y} />
    </ArtFrame>
  );
}
