interface LogoProps {
  size?: number;
}

/** Tile colours, left to right and top to bottom. */
const TILES = [
  "fill-brand-cream",
  "fill-brand-slate",
  "fill-riso-warm",
  "fill-riso-light",
  "fill-brand-red",
  "fill-brand-slate",
  "fill-riso-warm",
  "fill-brand-cream",
  "fill-brand-slate",
] as const;

const TILE_SIZE = 6.4;
const TILE_STEP = 7.6;
const TILE_OFFSET = 5;

/**
 * The brand mark: a 3x3 grid of rounded tiles in the riso inks, with the red
 * "cursor" tile in the middle, after the Languages glyph. public/favicon.svg
 * draws the same grid with literal colours.
 */
export function Logo({ size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="flex-none"
    >
      <rect width="32" height="32" rx="8" className="fill-brand-ground" />
      {TILES.map((fill, i) => (
        <rect
          key={i}
          x={TILE_OFFSET + (i % 3) * TILE_STEP}
          y={TILE_OFFSET + Math.floor(i / 3) * TILE_STEP}
          width={TILE_SIZE}
          height={TILE_SIZE}
          rx="1.8"
          className={fill}
        />
      ))}
    </svg>
  );
}
