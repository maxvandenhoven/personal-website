import type { SkillSummary } from "../../lib/content";
import { SkillCategory } from "./SkillCategory";

interface SkillGridProps {
  skills: readonly SkillSummary[];
}

export function SkillGrid({ skills }: SkillGridProps) {
  return (
    <div className="gap-gutter grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill) => (
        <SkillCategory key={skill.slug} skill={skill} />
      ))}
    </div>
  );
}
