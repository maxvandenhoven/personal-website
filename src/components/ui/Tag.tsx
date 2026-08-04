interface TagProps {
  label: string;
  size?: "sm" | "md";
}

export function Tag({ label, size = "sm" }: TagProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`tag-lift inline-flex items-center rounded-md border-[1.5px] border-[#000] bg-[#F5EEE0] font-bold whitespace-nowrap ${sizes[size]}`}
    >
      {label}
    </span>
  );
}
