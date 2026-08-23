import type { CSSProperties } from "react";

/**
 * Polaroid — a pinned, slightly tilted photo with a signature underneath.
 *
 * Looks like a physical polaroid stuck to the page: a push-pin SVG at the top
 * (domed head with a specular highlight and its own cast shadow), a small
 * tilt, layered lifted shadows, and a wide white bottom margin holding a
 * handwritten signature. Straightens and lifts on hover.
 *
 * Configurable via the central theme (src/styles/notebook.css), overridable
 * per-instance with props:
 *   pinColor       the push-pin color        (default --nb-pin)
 *   signature      handwritten text below    (rendered in --nb-font-signature)
 *   tilt           rotation, e.g. "-3deg"    (default 3deg, slightly clockwise)
 *
 * The image is passed in as a plain `src` string so the component stays
 * decoupled from Astro's asset pipeline (import the image in the page and
 * pass its `.src`).
 */
export interface PolaroidProps {
  src: string;
  alt: string;
  /** Handwritten line shown in the bottom margin. */
  signature?: string;
  /** Pin color override (default: --nb-pin). */
  pinColor?: string;
  /** Rotation of the whole polaroid (default: 3deg). */
  tilt?: string;
  /** Rendered photo size in px (square). */
  size?: number;
  className?: string;
}

export function Polaroid({
  src,
  alt,
  signature,
  pinColor,
  tilt,
  size = 300,
  className = "",
}: PolaroidProps) {
  const style: CSSProperties = {
    ...(pinColor ? { "--nb-pin": pinColor } : {}),
    ...(tilt ? { "--tilt": tilt } : {}),
    width: size + 28, // photo + 14px padding on each side
  } as CSSProperties;

  return (
    <figure className={`nb-polaroid ${className}`} style={style}>
      {/* Push-pin: cast shadow on the paper, a sliver of needle, and a domed
          head (base fill = --nb-pin) shaded by a radial falloff + specular. */}
      <svg
        className="nb-polaroid__pin"
        viewBox="0 0 44 44"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="nb-pin-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <radialGradient id="nb-pin-dome" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="42%" stopColor="rgba(255,255,255,0)" />
            <stop offset="72%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
          </radialGradient>
        </defs>
        {/* shadow the pin head casts onto the polaroid */}
        <ellipse
          cx="27"
          cy="32"
          rx="11"
          ry="4.5"
          fill="rgba(31,26,18,0.32)"
          filter="url(#nb-pin-blur)"
        />
        {/* the bit of needle visible between head and paper */}
        <path
          d="M22.5 23 L26.5 30"
          stroke="#8a8478"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* domed head */}
        <circle cx="19" cy="15.5" r="11.5" style={{ fill: "var(--nb-pin)" }} />
        <circle cx="19" cy="15.5" r="11.5" fill="url(#nb-pin-dome)" />
        {/* specular highlight */}
        <ellipse
          cx="15"
          cy="11.5"
          rx="3.6"
          ry="2.3"
          fill="rgba(255,255,255,0.8)"
          transform="rotate(-28 15 11.5)"
        />
      </svg>
      <img
        className="nb-polaroid__photo"
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ height: size }}
      />
      {signature && (
        <figcaption className="nb-polaroid__signature">{signature}</figcaption>
      )}
    </figure>
  );
}
