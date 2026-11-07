import { NAV_LINKS, type NavPage } from "../../lib/navigation";
import { MotionToggle } from "../riso/MotionToggle";
import { Logo } from "../ui/Logo";
import { NavMenu } from "./NavMenu";

interface HeaderProps {
  name: string;
  /** Highlighted in the navigation; omit on pages outside it. */
  currentPage?: NavPage;
}

/**
 * Sticky, translucent site header that bleeds to the viewport edges. Below the
 * md breakpoint the inline links make way for a menu button.
 */
export function Header({ name, currentPage }: HeaderProps) {
  return (
    <header className="bg-paper/88 border-rule -mx-page px-page sticky top-0 z-20 border-b backdrop-blur-[10px]">
      <nav
        aria-label="Main"
        className="max-w-site mx-auto flex items-center gap-3 py-3"
      >
        <a
          href="/"
          className="tracking-brand flex items-center gap-3 text-lg font-bold"
        >
          <Logo />
          {name}
        </a>
        <div className="mr-2 ml-auto hidden gap-1 md:flex">
          {NAV_LINKS.map(({ page, href, label }) => (
            <a
              key={page}
              href={href}
              aria-current={page === currentPage ? "page" : undefined}
              className="hover:bg-hover aria-[current=page]:bg-hover text-md rounded-full px-3 py-2 font-medium"
            >
              {label}
            </a>
          ))}
        </div>
        <MotionToggle className="max-md:ml-auto" />
        <NavMenu currentPage={currentPage} className="md:hidden" />
      </nav>
    </header>
  );
}
