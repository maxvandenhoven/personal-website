import { useState } from "react";

interface HexButtonProps {
  sideLength?: number;
  borderRadius?: number;
  fill?: string;
  shadow?: string;
  elevation?: number;
  img?: string;
  text?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}

function generateHexPath(sideLength: number, borderRadius: number): string {
  const w = Math.sqrt(3) * sideLength;
  const h = 2 * sideLength;

  const vertices = [
    { x: w / 2, y: 0 },
    { x: w, y: h / 4 },
    { x: w, y: (3 * h) / 4 },
    { x: w / 2, y: h },
    { x: 0, y: (3 * h) / 4 },
    { x: 0, y: h / 4 },
  ];

  if (borderRadius <= 0) {
    return (
      vertices.map((v, i) => `${i === 0 ? "M" : "L"}${v.x},${v.y}`).join(" ") +
      " Z"
    );
  }

  const offset = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    dist: number,
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    return { x: from.x + (dx / mag) * dist, y: from.y + (dy / mag) * dist };
  };

  const n = vertices.length;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n];
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];
    const start = offset(curr, prev, borderRadius);
    const end = offset(curr, next, borderRadius);
    if (i === 0) {
      parts.push(`M${start.x},${start.y}`);
    } else {
      parts.push(`L${start.x},${start.y}`);
    }
    parts.push(`Q${curr.x},${curr.y} ${end.x},${end.y}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

export function HexButton({
  sideLength = 100,
  borderRadius = 12,
  fill = "var(--color-surface-50)",
  shadow = "var(--color-surface-200)",
  elevation = 12,
  img,
  text,
  href,
  target,
  onClick,
}: HexButtonProps) {
  const [state, setState] = useState<"normal" | "hover" | "active">("normal");

  const w = Math.sqrt(3) * sideLength;
  const h = 2 * sideLength + elevation;
  const hexH = 2 * sideLength;
  const path = generateHexPath(sideLength, borderRadius);

  const translateY =
    state === "active" ? elevation : state === "hover" ? elevation / 2 : 0;
  const transition =
    state === "active" ? "transform 0.1s ease" : "transform 0.2s ease";

  const content = (
    <>
      {img && (
        <image
          href={img}
          width={w * 0.7}
          height={hexH * 0.7}
          x={w * 0.15}
          y={hexH * 0.12}
        />
      )}
      {text && (
        <text
          x={w / 2}
          y={hexH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text-primary)"
          style={{ fontSize: sideLength * 0.3, userSelect: "none" }}
        >
          {text}
        </text>
      )}
    </>
  );

  const foreground = (
    <g
      style={{
        transform: `translateY(${translateY}px)`,
        transition,
        cursor: "pointer",
      }}
      onMouseOver={() => setState("hover")}
      onMouseLeave={() => setState("normal")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      onClick={onClick}
    >
      <path d={path} fill={fill} />
      {content}
    </g>
  );

  const svg = (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <svg y={elevation}>
        <path d={path} fill={shadow} />
      </svg>
      {foreground}
    </svg>
  );

  if (href) {
    return (
      <a href={href} target={target ?? "_blank"} rel="noopener noreferrer">
        {svg}
      </a>
    );
  }

  return svg;
}
