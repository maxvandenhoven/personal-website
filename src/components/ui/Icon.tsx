import type { ReactNode } from "react";

const ICONS = {
  github: {
    viewBox: "0 0 16 16",
    body: (
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    ),
  },
  linkedin: {
    viewBox: "0 0 16 16",
    body: (
      <path
        fillRule="evenodd"
        d="M3 0h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zM4.6 3.15a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 1 0 0-2.5zM3.5 6.4h2.2v6.2H3.5zM7.2 6.4h2.1v.9c.4-.7 1.2-1.1 2.1-1.1 1.6 0 2.4 1 2.4 2.8v3.6h-2.2V9.4c0-.8-.3-1.3-1-1.3s-1.2.5-1.2 1.4v3.1H7.2z"
      />
    ),
  },
  play: {
    viewBox: "0 0 14 14",
    body: <path d="M3.5 2.5v9l8-4.5z" />,
  },
  pause: {
    viewBox: "0 0 14 14",
    body: (
      <>
        <rect x="3" y="2.5" width="2.6" height="9" rx="1" />
        <rect x="8.4" y="2.5" width="2.6" height="9" rx="1" />
      </>
    ),
  },
  close: {
    viewBox: "0 0 12 12",
    body: (
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" />
    ),
  },
} satisfies Record<string, { viewBox: string; body: ReactNode }>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  /** Width and height in pixels. */
  size: number;
  className?: string;
}

/** Decorative inline SVG icon drawn in the current text colour. */
export function Icon({ name, size, className }: IconProps) {
  const { viewBox, body } = ICONS[name];
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {body}
    </svg>
  );
}
