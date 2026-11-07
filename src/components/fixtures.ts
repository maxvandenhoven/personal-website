/** Sample content shared by the Storybook stories. */
import type { PostSummary, ProjectSummary, SkillSummary } from "../lib/content";
import type { SocialLink } from "../lib/social";

export const sampleSocials: SocialLink[] = [
  { platform: "github", url: "https://github.com/maxvandenhoven" },
  { platform: "linkedin", url: "https://www.linkedin.com/in/maxvdhoven" },
];

export const sampleProject: ProjectSummary = {
  slug: "skill-evals",
  title: "skill-evals",
  monospaceTitle: true,
  description:
    "A framework for evaluating agent skills across models and coding agents. By comparing isolated runs with and without a skill, it helps check whether the agent selects the instructions, follows the workflow, and produces a better result.",
  tags: ["AI agents", "Evaluation", "Sandboxing"],
  artwork: "projects/skill-evals",
  artworkAlt:
    "Rows of discs that light up or stay eclipsed as an evaluation sweep passes",
  url: "https://github.com/maxvandenhoven/skill-evals",
  status: "Open source",
};

export const sampleProjects: ProjectSummary[] = [
  sampleProject,
  {
    ...sampleProject,
    slug: "hive",
    title: "hive",
    description:
      "Hive is a two-player game in which insect tiles are used to surround the opponent's queen.",
    tags: ["Games", "Search", "Evaluation"],
    artwork: "projects/hive",
    artworkAlt:
      "Hexagonal tiles form a cluster as possible placements are scored",
    status: "In development",
  },
  {
    ...sampleProject,
    slug: "personal-website",
    title: "This website",
    monospaceTitle: false,
    description:
      "Built with Astro, React, and TypeScript, this site also gives me somewhere to experiment with generative illustrations.",
    tags: ["Web development", "Generative art"],
    artwork: "projects/personal-website",
    artworkAlt: "Markdown files are built block by block into a static page",
  },
];

export const samplePost: PostSummary = {
  slug: "the-risks-of-unprotected-agents-and-how-to-mitigate-them",
  title: "The risks of unprotected agents and how to mitigate them",
  description:
    "Running coding agents unattended raises questions about the access and credentials they need.",
  tags: ["AI agents", "Sandboxing", "Security"],
  artwork: "blogs/the-risks-of-unprotected-agents-and-how-to-mitigate-them",
  artworkAlt: "Agents moving inside rounded sandboxes, with one unguarded lane",
  href: "https://xebia.com/blog/the-risks-of-unprotected-agents-and-how-to-mitigate-them/",
  external: true,
  linkLabel: "Read on Xebia",
  dateLabel: "31 Jul 2026",
  readingTime: "17 min read",
};

export const sampleSkills: SkillSummary[] = [
  {
    slug: "languages",
    title: "Languages",
    artwork: "skills/languages",
    items: ["Python", "SQL", "TypeScript"],
  },
  {
    slug: "machine-learning",
    title: "Machine learning",
    artwork: "skills/machine-learning",
    items: ["Forecasting", "Gradient boosting", "MLflow"],
  },
  {
    slug: "ai-agents",
    title: "AI agents",
    artwork: "skills/ai-agents",
    items: [
      "Claude Code",
      "Codex",
      "Google ADK",
      "Evaluation",
      "Sandboxing",
      "Search",
    ],
  },
  {
    slug: "infrastructure",
    title: "Infrastructure",
    artwork: "skills/infrastructure",
    items: ["Docker", "Terraform"],
  },
];
