interface LogoProps {
  size?: number;
}

/** The "M" brand mark: a cream stroke over a misregistered orange one, plus a red dot. */
export function Logo({ size = 28 }: LogoProps) {
  const stroke = {
    d: "M7.5 21V8l6.5 7 6.5-7v13",
    fill: "none",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      className="flex-none"
    >
      <rect width="28" height="28" rx="7" className="fill-brand-ground" />
      <path
        {...stroke}
        className="stroke-riso-warm"
        transform="translate(1.3 1)"
      />
      <path {...stroke} className="stroke-brand-cream" />
      <circle cx="21.5" cy="6.5" r="2.4" className="fill-brand-red" />
    </svg>
  );
}
