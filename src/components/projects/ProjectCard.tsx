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
      figure={project.figure}
      figureAlt={project.figureAlt}
      title={project.title}
      monospaceTitle={project.monospaceTitle}
      description={project.description}
      tags={project.tags}
      meta={project.stage}
      action="View on GitHub"
    />
  );
}
