import { sectionIndex } from "../../lib/navigation";
import { SOCIAL_LABELS, type SocialLink } from "../../lib/social";
import { Eyebrow } from "../ui/Eyebrow";
import { Icon } from "../ui/Icon";

interface FooterProps {
  name: string;
  email: string;
  socials: readonly SocialLink[];
  contact: { title: string; description: string };
}

/** Dark contact band at the bottom of every page. */
export function Footer({ name, email, socials, contact }: FooterProps) {
  return (
    <footer id="contact" className="mt-section -mx-page relative z-1">
      <div className="bg-foot text-foot-text px-page">
        <div className="max-w-site mx-auto flex flex-col gap-16 pt-16 md:pt-24">
          <div className="gap-col-gap grid grid-cols-1 items-end md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-4">
              <Eyebrow className="text-foot-accent">
                {sectionIndex("contact")}
              </Eyebrow>
              <h2 className="leading-display text-5xl md:text-7xl">
                {contact.title}
              </h2>
              <p className="text-foot-muted max-w-measure-md text-lg">
                {contact.description}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="tracking-label text-foot-dim text-2xs font-mono leading-none font-medium uppercase">
                Email
              </span>
              <a
                href={`mailto:${email}`}
                className="hover:text-foot-accent text-2xl font-semibold"
              >
                {email}
              </a>
              <div className="flex flex-wrap gap-6">
                {socials.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foot-text hover:text-foot-accent text-md inline-flex min-h-11 items-center gap-2 font-semibold transition-colors duration-200"
                  >
                    <Icon name={platform} size={20} className="flex-none" />
                    {SOCIAL_LABELS[platform]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-foot-rule leading-meta text-foot-dim text-2xs flex flex-wrap justify-between gap-4 border-t pt-6 pb-[calc(--spacing(24)+env(safe-area-inset-bottom,0px))] font-mono">
            <span>
              © {new Date().getFullYear()} {name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
