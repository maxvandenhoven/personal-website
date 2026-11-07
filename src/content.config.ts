import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";
import { GLYPHS } from "./lib/riso/catalog";
import { SOCIAL_PLATFORMS } from "./lib/social";

/** Drafts are shown by `make dev` but left out of the build. */
const draft = z.boolean().default(false);

/**
 * Description of the animated artwork in the entry's folder (artwork.ts), for
 * screen readers. Every published entry needs an artwork.
 */
const artwork_alt = z.string();

const blogs = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/blogs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    reading_time: z.string(),
    tags: z.array(z.string()),
    publish_date: z.iso.date(),
    /**
     * Set for articles published on another site: the card links to `url` and
     * reads "Read on <name>". Leave it out to host the article here, written as
     * the Markdown body.
     */
    external: z
      .object({
        url: z.url(),
        name: z.string(),
      })
      .optional(),
    artwork_alt,
    draft,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/projects" }),
  schema: z.object({
    title: z.string(),
    /** Set the title in the monospace font, for repository-style names. */
    monospace_title: z.boolean().default(false),
    description: z.string(),
    github_link: z.url(),
    tags: z.array(z.string()),
    /** Shown on the card, e.g. "Open source" or "In development". */
    status: z.string(),
    /** Position on the projects page; lower comes first. */
    order: z.number().int(),
    artwork_alt,
    draft,
  }),
});

const site = defineCollection({
  loader: file("content/site.yaml"),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    email: z.email(),
    socials: z.array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        url: z.url(),
      }),
    ),
    contact: z.object({
      title: z.string(),
      description: z.string(),
    }),
    projects_page: z.object({
      description: z.string(),
      lead: z.string(),
    }),
    blog_page: z.object({
      description: z.string(),
      lead: z.string(),
    }),
  }),
});

const homepage = defineCollection({
  loader: file("content/homepage.yaml"),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      description: z.string(),
      portrait_alt: z.string(),
    }),
    about: z.object({
      title: z.string(),
      lede: z.string(),
      /** Paragraphs support inline links: [text](https://...) */
      paragraphs: z.array(z.string()),
      education: z.object({
        title: z.string(),
        steps: z.array(
          z.object({
            school: z.string(),
            degree: z.string(),
            description: z.string(),
          }),
        ),
      }),
      skills: z.array(
        z.object({
          title: z.string(),
          glyph: z.enum(GLYPHS),
          items: z.array(z.string()),
        }),
      ),
    }),
    featured_projects: z.object({
      title: z.string(),
      slugs: z.array(z.string()),
    }),
    featured_blogs: z.object({
      title: z.string(),
      slugs: z.array(z.string()),
    }),
  }),
});

export const collections = { blogs, projects, site, homepage };
