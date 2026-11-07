import { SkillCategory, type Skill } from "./SkillCategory";

interface SkillGridProps {
  skills: readonly Skill[];
}

export function SkillGrid({ skills }: SkillGridProps) {
  return (
    <div className="gap-gutter grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill) => (
        <SkillCategory key={skill.title} {...skill} />
      ))}
    </div>
  );
}
