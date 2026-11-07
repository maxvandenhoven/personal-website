/**
 * Site structure shared by the header, section headings and page headings.
 * Sections are numbered in the order they appear on the homepage.
 */

export type NavPage = "home" | "projects" | "blog";

export interface NavLink {
  page: NavPage;
  href: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { page: "home", href: "/", label: "Home" },
  { page: "projects", href: "/projects", label: "Projects" },
  { page: "blog", href: "/blog", label: "Blog" },
];

const SECTIONS = {
  about: "About",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact",
} as const;

export type SectionKey = keyof typeof SECTIONS;

/** Label such as "02 / Projects" for a numbered section. */
export function sectionIndex(key: SectionKey): string {
  const position = Object.keys(SECTIONS).indexOf(key) + 1;
  return `${String(position).padStart(2, "0")} / ${SECTIONS[key]}`;
}
