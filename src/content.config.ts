import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

const blogs = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/blogs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    reading_time: z.string(),
    tags: z.array(z.string()),
    status: z.enum(["draft", "published"]),
    publish_date: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github_link: z.string(),
    technologies: z.array(z.string()),
    background_color: z.string(),
    foreground_color: z.string(),
    relevant_blogs: z.array(z.string()),
    status: z.enum(["draft", "published"]),
  }),
});

const homepage = defineCollection({
  loader: file("content/homepage.yaml"),
  schema: z.object({
    name: z.string(),
    job_title: z.string(),
    hero_tagline: z.string(),
    hero_description: z.string(),
    github_link: z.string(),
    linkedin_link: z.string(),
    twitter_link: z.string(),
    email_link: z.string(),
    skills_description: z.string(),
    skills: z.array(
      z.object({
        skill_title: z.string(),
        entries: z.array(z.string()),
      }),
    ),
    featured_projects: z.array(z.string()),
    featured_blogs: z.array(z.string()),
  }),
});

export const collections = { blogs, projects, homepage };
