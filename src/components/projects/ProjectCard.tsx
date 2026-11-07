import type { ProjectSummary } from "../../lib/content";
import { Card } from "../ui/Card";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      href={project.url}
      external
      artwork={project.artwork}
      artworkAlt={project.artworkAlt}
      title={project.title}
      monospaceTitle={project.monospaceTitle}
      description={project.description}
      tags={project.tags}
      meta={project.status}
      action="View on GitHub"
    />
  );
}
