import type { SocialLink } from "../../lib/social";
import { ArtFrame } from "../ui/ArtFrame";
import { SocialButtons } from "../ui/SocialButtons";

export interface Portrait {
  src: string;
  srcSet?: string;
  sizes?: string;
  width: number;
  height: number;
  alt: string;
}

interface HeroProps {
  title: string;
  description: string;
  socials: readonly SocialLink[];
  portrait: Portrait;
}

export function Hero({ title, description, socials, portrait }: HeroProps) {
  return (
    <section
      aria-label="Introduction"
      className="gap-col-gap grid grid-cols-1 items-center md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    >
      <div className="flex min-w-0 flex-col gap-6">
        <h1 className="text-display leading-display">{title}</h1>
        <p className="text-muted max-w-measure leading-copy text-xl">
          {description}
        </p>
        <SocialButtons socials={socials} className="mt-2" />
      </div>
      <figure className="rounded-card border-rule bg-card p-frame min-w-0 border">
        <ArtFrame className="rounded-art aspect-square w-full">
          <img
            src={portrait.src}
            srcSet={portrait.srcSet}
            sizes={portrait.sizes}
            width={portrait.width}
            height={portrait.height}
            alt={portrait.alt}
            fetchPriority="high"
            className="block size-full object-cover"
          />
        </ArtFrame>
      </figure>
    </section>
  );
}
