import { Fragment, type ReactNode } from "react";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

interface InlineMarkdownProps {
  text: string;
}

/**
 * Render plain text from the CMS, turning `[label](https://...)` into links.
 * Deliberately minimal: no other Markdown, and no raw HTML is ever injected.
 */
export function InlineMarkdown({ text }: InlineMarkdownProps) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    parts.push(text.slice(cursor, match.index));
    const external = /^https?:\/\//.test(href);
    parts.push(
      <a
        key={match.index}
        href={href}
        className="underline"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {label}
      </a>,
    );
    cursor = match.index + whole.length;
  }
  parts.push(text.slice(cursor));
  return <Fragment>{parts}</Fragment>;
}
