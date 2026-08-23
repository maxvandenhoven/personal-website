import type { CSSProperties } from "react";
import { Pill } from "../ui/Pill";

/**
 * TapedBlogCard — a blog card of "card stock" held down by washi tape.
 *
 * Banner, title, description, then (pinned to the bottom of the card) a
 * reading-time + date meta line with the tag pills as the very last row.
 * Lifts and straightens on hover. Colors and fonts come from the central
 * theme (--nb-card-bg, --nb-tape, --nb-pill-*, the --nb-font-* stacks) and
 * can be overridden per-instance with props.
 *
 * Usage:
 *   <TapedBlogCard title=... description=... readingTime="6 min read"
 *                  publishDate="2026-03-14" tags={["writing"]} href="/blog/x"
 *                  bannerSrc={src} tilt="1deg" />
 */
export interface TapedBlogCardProps {
  title: string;
  description: string;
  readingTime: string;
  publishDate: string;
  tags: string[];
  href: string;
  bannerSrc?: string;
  /** Resting rotation of the card (e.g. "-1deg"). */
  tilt?: string;
  /** Card background override (default --nb-card-bg). */
  bg?: string;
}

export function TapedBlogCard({
  title,
  description,
  readingTime,
  publishDate,
  tags,
  href,
  bannerSrc,
  tilt,
  bg,
}: TapedBlogCardProps) {
  const formattedDate = new Date(publishDate + "T00:00:00").toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  const style: CSSProperties = {
    ...(tilt ? { "--card-tilt": tilt } : {}),
    ...(bg ? { "--nb-card-bg": bg } : {}),
  } as CSSProperties;

  return (
    <a
      href={href}
      className="nb-taped-card"
      style={style}
      aria-label={`Read: ${title}`}
    >
      <span className="nb-taped-card__tape" aria-hidden="true"></span>
      <div
        className="nb-taped-card__banner"
        style={
          bannerSrc ? { backgroundImage: `url('${bannerSrc}')` } : undefined
        }
      ></div>
      <div className="nb-taped-card__body">
        <h3 className="nb-taped-card__title">{title}</h3>
        <p className="nb-taped-card__desc">{description}</p>
        <div className="nb-taped-card__meta">
          <span>{readingTime}</span>
          <span className="nb-dot" aria-hidden="true"></span>
          <span>{formattedDate}</span>
        </div>
        {tags.length > 0 && (
          <div className="nb-taped-card__pills">
            {tags.map((tag) => (
              <Pill key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
