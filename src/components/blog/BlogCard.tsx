import { Tag } from "../ui";

const BANNER_PALETTES = [
  { base: "#1a1a2a", stripe: "#222238", pill: "#FFD23F", pillText: "#000" },
  { base: "#1a2a1a", stripe: "#223322", pill: "#88D498", pillText: "#000" },
  { base: "#2a1a1a", stripe: "#332222", pill: "#FF6B6B", pillText: "#000" },
  { base: "#0c1a2a", stripe: "#112233", pill: "#74B9FF", pillText: "#000" },
  { base: "#1a1a2a", stripe: "#222238", pill: "#B8A9FA", pillText: "#000" },
  { base: "#2a1a0c", stripe: "#331a00", pill: "#FFA552", pillText: "#000" },
];

function slugBanner(slug: string): (typeof BANNER_PALETTES)[0] {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return BANNER_PALETTES[Math.abs(hash) % BANNER_PALETTES.length];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface BlogCardProps {
  title: string;
  description: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
  href: string;
  slug: string;
}

export function BlogCard({
  title,
  description,
  publishDate,
  readingTime,
  tags,
  href,
  slug,
}: BlogCardProps) {
  const banner = slugBanner(slug);

  return (
    <a
      href={href}
      className="card-lift block cursor-pointer overflow-hidden rounded-[14px] border-2 border-[#000] bg-white shadow-lg select-none"
    >
      <div
        className="relative flex h-[160px] items-center justify-center"
        style={{ background: banner.base }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(45deg, ${banner.base} 0, ${banner.base} 18px, ${banner.stripe} 18px, ${banner.stripe} 36px)`,
          }}
        />
        <div
          className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#000] px-2.5 py-1 text-[11px] font-bold"
          style={{ background: banner.pill, color: banner.pillText }}
        >
          {readingTime}
        </div>
      </div>
      <div className="p-4 pb-3.5">
        <p className="text-text-secondary mb-1.5 text-[13px]">
          {formatDate(publishDate)}
        </p>
        <h3 className="font-heading mb-1.5 text-[17px] leading-snug font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-text-secondary mb-3 text-[13px] leading-relaxed">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
