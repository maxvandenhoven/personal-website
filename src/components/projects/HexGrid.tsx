interface ProjectData {
  title: string;
  description: string;
  githubLink: string;
  technologies: string[];
  backgroundColor: string;
  foregroundColor: string;
  slug: string;
}

interface HexGridProps {
  projects: ProjectData[];
}

const HEX_SIZE = 192;

function honeycombRows(count: number): number[] {
  if (count <= 0) return [];
  if (count <= 3) return [count];
  const rows: number[] = [];
  let remaining = count;
  let narrow = true;
  while (remaining > 0) {
    const size = narrow ? Math.min(2, remaining) : Math.min(3, remaining);
    rows.push(size);
    remaining -= size;
    narrow = !narrow;
  }
  return rows;
}

function HexTile({ project }: { project: ProjectData }) {
  return (
    <a
      href={project.githubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mx-[9px] block cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 hover:scale-105"
      style={{ width: HEX_SIZE, height: HEX_SIZE }}
    >
      <div
        className="grid h-full w-full place-items-center"
        style={{
          backgroundColor: project.backgroundColor,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          filter: "drop-shadow(0 10px 22px rgba(21, 0, 39, 0.14))",
        }}
      >
        <span
          className="text-center text-[15px] leading-tight font-medium"
          style={{
            color: project.foregroundColor,
            textShadow: "0 1px 6px rgba(0,0,0,0.3)",
            maxWidth: "70%",
          }}
        >
          {project.title}
        </span>
      </div>
      <div className="border-accent-400/30 bg-primary-900 pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-3 w-72 -translate-x-1/2 translate-y-2 rounded-xl border p-5 text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">{project.title}</span>
          {project.technologies[0] && (
            <span className="text-accent-400 text-xs font-medium">
              {project.technologies[0]}
            </span>
          )}
        </div>
        <p className="mb-3 text-sm leading-relaxed text-white/80">
          {project.description}
        </p>
        <span className="text-accent-400 text-xs font-medium">
          View on GitHub &rarr;
        </span>
        <div className="border-t-primary-900 absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent" />
      </div>
    </a>
  );
}

export function HexGrid({ projects }: HexGridProps) {
  const rows = honeycombRows(projects.length);
  const rowOffsets = rows.reduce<number[]>(
    (acc, size) => [...acc, (acc[acc.length - 1] ?? 0) + size],
    [],
  );

  return (
    <div className="flex flex-col items-center py-10">
      {rows.map((rowSize, rowIndex) => {
        const start = rowIndex === 0 ? 0 : rowOffsets[rowIndex - 1];
        const tiles = projects.slice(start, start + rowSize);
        return (
          <div
            key={rowIndex}
            className="flex justify-center"
            style={{ marginTop: rowIndex > 0 ? HEX_SIZE * -0.235 : 0 }}
          >
            {tiles.map((project) => (
              <HexTile key={project.slug} project={project} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
