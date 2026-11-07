# Design reference

Static HTML mockups of the site's visual design. The Astro site in `src/` reproduces
them from the CMS in `content/`; these files are kept as they were designed, so they
can be compared against the built site.

- `Max van den Hoven (4).html`: homepage
- `projects.html`, `blog.html`: listing pages
- `mockup/site.css`, `mockup/site.js`: shared styles and scripts (risograph renderer, filters, print settings)
- `mockup/sync_pages.py`: copies the shared chrome from the homepage into the listing pages
- `content/headshot.png`: symlink to the site's portrait, so the mockups render from this folder

To view them, serve this folder (fonts load from Google Fonts):

```sh
python3 -m http.server -d docs/reference
```
