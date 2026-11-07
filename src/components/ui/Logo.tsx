interface LogoProps {
  size?: number;
}

/**
 * Where the dark disc (centre 23,13.6) overlaps the orange one (centre 16,16),
 * both r = 10.5: a lens of two arcs. Drawn directly rather than with a clip
 * path, so the mark needs no document-unique ids.
 */
const SHADOW =
  "M16.31 5.5A10.5 10.5 0 0 1 22.69 24.1A10.5 10.5 0 0 1 16.31 5.5Z";

/**
 * The brand mark: an orange disc partly eclipsed by dark ink, after the
 * pass/fail markers in the artworks. public/favicon.svg draws the same mark
 * with literal colours.
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
      <rect width="32" height="32" rx="8" className="fill-art" />
      <circle cx="16" cy="16" r="10.5" className="fill-riso-warm" />
      <path d={SHADOW} className="fill-riso-dark" />
    </svg>
  );
}
