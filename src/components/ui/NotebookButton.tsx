import type { CSSProperties, ReactNode } from "react";

/**
 * NotebookButton — the primary call-to-action button.
 *
 * A firm paper button that presses down slightly when clicked. The background
 * color is a parameter: it defaults to --nb-button-bg from the central theme
 * (src/styles/notebook.css), or pass `bg` (and optionally `text`) to override
 * this instance.
 *
 * Usage:
 *   <NotebookButton href="/blog">Read the blog</NotebookButton>
 *   <NotebookButton href="/blog" bg="var(--nb-accent)">Read the blog</NotebookButton>
 */
export interface NotebookButtonProps {
  href: string;
  /** Background color override (default: --nb-button-bg). */
  bg?: string;
  /** Text color override (default: --nb-button-text). */
  text?: string;
  className?: string;
  children: ReactNode;
}

export function NotebookButton({
  href,
  bg,
  text,
  className = "",
  children,
}: NotebookButtonProps) {
  const style: CSSProperties = {
    ...(bg ? { "--nb-button-bg": bg } : {}),
    ...(text ? { "--nb-button-text": text } : {}),
  } as CSSProperties;

  return (
    <a href={href} className={`nb-button ${className}`} style={style}>
      {children}
    </a>
  );
}
