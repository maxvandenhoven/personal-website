import type { CSSProperties } from "react";

/**
 * StickyNote — a realistic sticky note for a group of skills.
 *
 * A darker matte adhesive band presses the top flat against the page; the
 * bottom curls toward the viewer (catch-light gradient + skewed shadow wings
 * under the corners) and paper-fiber grain covers the whole note. Straightens
 * on hover. All the rendering lives in src/styles/notebook.css.
 *
 * Configurable via props (all optional except title/items):
 *   bg         background color        (default --nb-sticky)
 *   tilt       resting rotation        (e.g. "-1.5deg")
 *   titleFont  heading font override   (default --nb-font-heading)
 *   listFont   skill-list font override(default --nb-font-mono)
 *
 * Usage:
 *   <StickyNote title="Languages" items={["Python","Rust"]} bg="var(--nb-sticky-2)" />
 */
export interface StickyNoteProps {
  title: string;
  items: string[];
  bg?: string;
  tilt?: string;
  titleFont?: string;
  listFont?: string;
  className?: string;
}

export function StickyNote({
  title,
  items,
  bg,
  tilt,
  titleFont,
  listFont,
  className = "",
}: StickyNoteProps) {
  const style: CSSProperties = {
    ...(bg ? { "--sticky-bg": bg } : {}),
    ...(tilt ? { "--sticky-tilt": tilt } : {}),
  } as CSSProperties;

  return (
    <div className={`nb-sticky-note ${className}`} style={style}>
      <h3
        className="nb-sticky-note__title"
        style={titleFont ? { fontFamily: titleFont } : undefined}
      >
        {title}
      </h3>
      <ul
        className="nb-sticky-note__list"
        style={listFont ? { fontFamily: listFont } : undefined}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
