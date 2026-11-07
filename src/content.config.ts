import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";
import { SOCIAL_PLATFORMS } from "./lib/social";

/** Drafts are shown by `make dev` but left out of the build. */
const draft = z.boolean().default(false);

/**
 * Description of the animated artwork in the entry's folder (artwork.ts), for
 * screen readers. Every visible entry needs an artwork.
 */
const artwork_alt = z.string();

/*
 * Skills, projects and blog posts are self-contained folders under content/
 * (index.md + artwork.ts). The homepage picks which ones to show by folder
 * name; the listing pages show all of them.
 */

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
    artwork_alt,
    draft,
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/skills" }),
  schema: z.object({
    title: z.string(),
    items: z.array(z.string()),
    /* The artwork is a small decorative glyph next to the title, so it needs no alt text. */
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
      /** Folders in content/skills, in display order. */
      skills: z.array(reference("skills")),
    }),
    featured_projects: z.object({
      title: z.string(),
      /** Folders in content/projects, in display order. */
      projects: z.array(reference("projects")),
    }),
    featured_blogs: z.object({
      title: z.string(),
      /** Folders in content/blogs, in display order. */
      blogs: z.array(reference("blogs")),
    }),
  }),
});

export const collections = { blogs, projects, skills, site, homepage };
