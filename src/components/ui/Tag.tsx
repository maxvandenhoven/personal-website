interface TagProps {
  label: string;
}

/** Static topic label on a card. */
export function Tag({ label }: TagProps) {
  return (
    <span className="rounded-chip bg-chip text-2xs px-3 py-2 font-mono leading-none font-medium">
      {label}
    </span>
  );
}
