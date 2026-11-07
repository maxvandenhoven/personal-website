"""Sync the shared page chrome from the home page into the listing pages.

The home page is the source of truth for everything shared: <head> (fonts,
stylesheet), header/nav, footer, and the print-settings dock. Each listing page
owns its own content: <title>, meta description and the whole <main> element.

So edit content directly in blog.html / projects.html, edit shared chrome in the
home page, then run (from the repo root):

    python3 -I mockup/sync_pages.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOME_FILE = ROOT / "Max van den Hoven (4).html"
HOME_HREF = "Max%20van%20den%20Hoven%20(4).html"

# page file -> nav key highlighted as the current page
PAGES = {"projects.html": "projects", "blog.html": "blog"}

TITLE = re.compile(r"<title>.*?</title>", re.S)
DESC = re.compile(r'<meta name="description" content="[^"]*">')
MAIN = re.compile(r"  <main\b.*?</main>", re.S)
NAV = re.compile(r'<div class="links">\s*(.*?)\s*</div>', re.S)


def one(pattern: re.Pattern[str], text: str, what: str, where: str) -> str:
    found = [m.group(0) for m in pattern.finditer(text)]
    if len(found) != 1:
        sys.exit(f"expected exactly one {what} in {where}, found {len(found)}")
    return found[0]


def nav_links(active: str) -> str:
    cur = lambda key: ' aria-current="page"' if key == active else ""
    return (
        f'<a href="{HOME_HREF}"{cur("home")}>Home</a>'
        f'<a href="projects.html"{cur("projects")}>Projects</a>'
        f'<a href="blog.html"{cur("blog")}>Blog</a>'
    )


def main() -> None:
    home = HOME_FILE.read_text()
    # fail loudly if the home page structure changed in a way this script doesn't understand
    for pattern, what in [(TITLE, "<title>"), (DESC, "meta description"), (MAIN, "<main>"), (NAV, "nav links")]:
        one(pattern, home, what, HOME_FILE.name)
    if nav_links("home") not in home:
        sys.exit(f"nav in {HOME_FILE.name} no longer matches the expected Home/Projects/Blog links; update nav_links()")

    for name, active in PAGES.items():
        path = ROOT / name
        page = path.read_text()
        title = one(TITLE, page, "<title>", name)
        desc = one(DESC, page, "meta description", name)
        body = one(MAIN, page, "<main>", name)

        out = home
        out = TITLE.sub(lambda _: title, out, count=1)
        out = DESC.sub(lambda _: desc, out, count=1)
        out = MAIN.sub(lambda _: body, out, count=1)
        out = out.replace(nav_links("home"), nav_links(active), 1)
        out = out.replace('<a class="brand" href="#top">', f'<a class="brand" href="{HOME_HREF}">', 1)

        if out != page:
            path.write_text(out)
            print(f"updated {name}")
        else:
            print(f"{name} already in sync")


if __name__ == "__main__":
    main()
