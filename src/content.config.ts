import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";
import { GLYPHS, ILLUSTRATIONS } from "./lib/riso/catalog";
import { SOCIAL_PLATFORMS } from "./lib/social";

const status = z.enum(["draft", "published"]);

/** Every card shows an animated risograph illustration, described for screen readers. */
const illustration = {
  figure: z.enum(ILLUSTRATIONS),
  figure_alt: z.string(),
};

const blogs = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/blogs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    reading_time: z.string(),
    tags: z.array(z.string()),
    status,
    publish_date: z.iso.date(),
    /** Shown as "Updated <date>" and used for sorting when set. */
    updated_date: z.iso.date().optional(),
    /**
     * Where the article was originally published. Cards link there, and a local
     * copy (if the post has a body) points its canonical URL at it.
     */
    external: z
      .object({
        url: z.url(),
        site: z.string(),
      })
      .optional(),
    ...illustration,
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
    /** Short state shown on the card, e.g. "Open source" or "In development". */
    stage: z.string(),
    /** Position on the projects page; lower comes first. */
    order: z.number().int(),
    status,
    ...illustration,
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
