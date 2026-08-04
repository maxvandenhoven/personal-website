const TAG_COLORS = [
  { bg: "#FFD23F", text: "#000" },
  { bg: "#FF6B6B", text: "#000" },
  { bg: "#74B9FF", text: "#000" },
  { bg: "#88D498", text: "#000" },
  { bg: "#FFA552", text: "#000" },
  { bg: "#B8A9FA", text: "#000" },
];

function labelColor(label: string): (typeof TAG_COLORS)[0] {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = ((hash << 5) - hash + label.charCodeAt(i)) | 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

interface TagProps {
  label: string;
  size?: "sm" | "md";
}

export function Tag({ label, size = "sm" }: TagProps) {
  const color = labelColor(label);
  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`tag-lift inline-flex items-center rounded-md border-[1.5px] border-[#000] font-bold whitespace-nowrap ${sizes[size]}`}
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {label}
    </span>
  );
}
