import { cx } from "../../lib/cx";
import { SOCIAL_LABELS, type SocialLink } from "../../lib/social";
import { Icon } from "./Icon";

interface SocialButtonsProps {
  socials: readonly SocialLink[];
  className?: string;
}

/** Square icon buttons linking to social profiles. */
export function SocialButtons({ socials, className }: SocialButtonsProps) {
  return (
    <div className={cx("flex flex-wrap gap-3", className)}>
      {socials.map(({ platform, url }) => (
        <a
          key={platform}
          href={url}
          aria-label={SOCIAL_LABELS[platform]}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-art border-rule bg-card text-ink hover:border-ink grid size-12 place-items-center border transition-[transform,border-color] duration-200 hover:-translate-y-0.5"
        >
          <Icon name={platform} size={22} />
        </a>
      ))}
    </div>
  );
}
