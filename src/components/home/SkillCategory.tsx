import type { Glyph } from "../../lib/riso/catalog";
import { Chip } from "../ui/Chip";
import { RisoFigure } from "../ui/RisoFigure";

export interface Skill {
  title: string;
  glyph: Glyph;
  items: readonly string[];
}

export function SkillCategory({ title, glyph, items }: Skill) {
  return (
    <div className="rounded-card border-rule bg-card p-inset flex flex-col gap-5 border">
      <div className="flex items-center gap-3">
        <RisoFigure figure={glyph} className="rounded-chip size-10 flex-none" />
        <h3 className="leading-title tracking-label font-mono text-xs font-medium uppercase">
          {title}
        </h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
