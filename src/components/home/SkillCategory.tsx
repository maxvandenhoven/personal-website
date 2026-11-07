import type { SkillSummary } from "../../lib/content";
import { Chip } from "../ui/Chip";
import { RisoFigure } from "../ui/RisoFigure";

interface SkillCategoryProps {
  skill: SkillSummary;
}

export function SkillCategory({ skill }: SkillCategoryProps) {
  return (
    <div className="rounded-card border-rule bg-card p-inset flex flex-col gap-5 border">
      <div className="flex items-center gap-3">
        <RisoFigure
          figure={skill.artwork}
          className="rounded-chip size-10 flex-none"
        />
        <h3 className="leading-title tracking-label font-mono text-xs font-medium uppercase">
          {skill.title}
        </h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {skill.items.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
