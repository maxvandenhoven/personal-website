import { InlineMarkdown } from "../ui/InlineMarkdown";

interface AboutStoryProps {
  lede: string;
  /** Plain text with optional inline links: [label](https://...) */
  paragraphs: readonly string[];
}

export function AboutStory({ lede, paragraphs }: AboutStoryProps) {
  return (
    <div className="max-w-measure flex flex-col gap-4">
      <p className="font-title leading-lede tracking-title mb-2 text-3xl">
        {lede}
      </p>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-prose text-muted">
          <InlineMarkdown text={paragraph} />
        </p>
      ))}
    </div>
  );
}
