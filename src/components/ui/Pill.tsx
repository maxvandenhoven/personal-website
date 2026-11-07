import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cx } from "../../lib/cx";

interface PillOwnProps {
  children: ReactNode;
  /** Square 40px button holding only an icon. */
  iconOnly?: boolean;
  className?: string;
}

type PillLinkProps = PillOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof PillOwnProps> & {
    href: string;
  };

type PillButtonProps = PillOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof PillOwnProps> & {
    href?: undefined;
  };

export type PillProps = PillLinkProps | PillButtonProps;

/** Rounded control in the monospace label style; a link when given `href`, else a button. */
export function Pill(props: PillProps) {
  const classes = cx(
    "group border-rule bg-card text-ink hover:border-ink tracking-mono inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border font-mono text-xs leading-none font-medium [&_svg]:flex-none",
    props.iconOnly ? "w-10 justify-center p-0" : "pr-4 pl-3",
    props.className,
  );

  if (props.href !== undefined) {
    const { children, iconOnly, className, ...rest } = props;
    return (
      <a {...rest} className={classes}>
        {children}
      </a>
    );
  }

  const { children, iconOnly, className, ...rest } = props;
  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
