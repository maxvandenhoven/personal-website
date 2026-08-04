import { Tag } from "../ui";

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
  bannerSrc?: string;
}

export function BlogCard({
  title,
  description,
  publishDate,
  readingTime,
  tags,
  href,
  bannerSrc,
}: BlogCardProps) {
  return (
    <a
      href={href}
      className="card-lift block cursor-pointer overflow-hidden rounded-[14px] border-2 border-[#000] bg-white select-none"
    >
      <div className="bg-surface-300 relative aspect-video overflow-hidden">
        {bannerSrc && (
          <img src={bannerSrc} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#000] bg-[#F5EEE0] px-3 py-1 text-xs font-bold">
          {readingTime}
        </div>
      </div>
      <div className="p-5">
        <p className="text-text-secondary mb-2 text-[13px]">
          {formatDate(publishDate)}
        </p>
        <h3 className="font-heading mb-2 text-xl leading-snug font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-text-secondary mb-4 text-sm leading-relaxed">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
