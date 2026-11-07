import type { ButtonHTMLAttributes, ReactNode } from "react";

const BASE =
  "rounded-chip bg-chip border border-transparent px-3 py-2 text-sm leading-none font-medium text-ink transition-[border-color,background-color,transform] duration-200";
/* Lift on hover and focus, except for a pressed filter chip. */
const LIFT =
  "hover:not-aria-pressed:border-ink hover:not-aria-pressed:bg-card hover:not-aria-pressed:-translate-y-px focus-visible:not-aria-pressed:border-ink focus-visible:not-aria-pressed:bg-card focus-visible:not-aria-pressed:-translate-y-px";
const PRESSED =
  "aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper";

type ChipProps = {
  children: ReactNode;
  /**
   * Render as a toggle button with this pressed state. Leave undefined for a
   * static chip.
   */
  pressed?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

/** Rounded label: static (skills) or a toggle button (topic filters). */
export function Chip({ children, pressed, ...buttonProps }: ChipProps) {
  if (pressed === undefined) {
    return (
      <span className={`${BASE} ${LIFT} inline-block cursor-default`}>
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`${BASE} ${LIFT} ${PRESSED} cursor-pointer`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
