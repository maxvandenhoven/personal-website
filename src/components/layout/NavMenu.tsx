import { cx } from "../../lib/cx";
import { NAV_LINKS, type NavPage } from "../../lib/navigation";
import { Icon } from "../ui/Icon";
import { Pill } from "../ui/Pill";

const PANEL_ID = "nav-menu";

interface NavMenuProps {
  /** Highlighted in the menu; omit on pages outside the navigation. */
  currentPage?: NavPage;
  className?: string;
}

/**
 * Menu button with a dropdown of the main navigation, for screens too narrow
 * for the inline links. Rendered closed; src/scripts/nav-menu.ts opens and
 * closes it.
 */
export function NavMenu({ currentPage, className }: NavMenuProps) {
  return (
    <div data-nav-menu="" className={cx("relative", className)}>
      <Pill
        iconOnly
        data-nav-menu-toggle=""
        aria-expanded={false}
        aria-controls={PANEL_ID}
        aria-label="Open menu"
        title="Open menu"
      >
        <Icon name="menu" size={14} className="group-aria-expanded:hidden" />
        <Icon
          name="close"
          size={12}
          className="hidden group-aria-expanded:block"
        />
      </Pill>
      <div
        id={PANEL_ID}
        hidden
        className="rounded-card border-rule bg-card shadow-sheet absolute top-full right-0 mt-2 w-56 border p-2"
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map(({ page, href, label }) => (
            <li key={page}>
              <a
                href={href}
                aria-current={page === currentPage ? "page" : undefined}
                className="rounded-control hover:bg-hover aria-[current=page]:bg-hover text-md block px-3 py-2.5 font-medium"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
