#!/usr/bin/env node
/**
 * Previews an artwork.ts with the site's real risograph painter.
 *
 *   node .claude/skills/riso-artwork/scripts/preview.mjs <artwork.ts> [--port 4400] [--out <dir>]
 *
 * By default the script bundles the artwork together with viewer.js, serves the
 * result on http://127.0.0.1:<port> and reloads the page whenever the artwork
 * changes. With --out it only writes the static files and exits.
 *
 * esbuild comes with Vite, so `npm ci` in the repository root is all it needs.
 */
import { context } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptsDir, "../../../..");

function fail(message) {
  console.error(`preview: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { artwork: undefined, port: 4400, out: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--port") args.port = Number(argv[++i]);
    else if (arg === "--out") args.out = argv[++i];
    else if (arg.startsWith("--")) fail(`unknown option ${arg}`);
    else args.artwork = arg;
  }
  if (!args.artwork) {
    fail("usage: preview.mjs <artwork.ts> [--port 4400] [--out <dir>]");
  }
  if (!Number.isInteger(args.port)) fail("--port needs a number");
  return args;
}

/** Reads the ink and paper colors from the design tokens, so the preview never drifts from the site. */
function readPaletteCss() {
  const css = readFileSync(
    path.join(repoRoot, "src/styles/global.css"),
    "utf8",
  );
  const tokens = [
    "--color-art",
    "--color-riso-warm",
    "--color-riso-dark",
    "--color-riso-light",
  ];
  return tokens
    .map((token) => {
      const match = new RegExp(`${token}:\\s*([^;]+);`).exec(css);
      if (!match) fail(`${token} is missing from src/styles/global.css`);
      return `${token}: ${match[1].trim()};`;
    })
    .join(" ");
}

const { artwork, port, out } = parseArgs(process.argv.slice(2));
const artworkPath = path.resolve(artwork);
const relative = path.relative(repoRoot, artworkPath);
const kind = relative.split(path.sep).join("/").startsWith("content/skills/")
  ? "glyph"
  : "card";
const outDir = path.resolve(
  out ?? path.join(repoRoot, "node_modules/.cache/riso-preview"),
);
const serving = out === undefined;

mkdirSync(outDir, { recursive: true });
const template = readFileSync(path.join(scriptsDir, "preview.html"), "utf8");
const reload = serving
  ? `<script>new EventSource("/esbuild").addEventListener("change", () => location.reload());</script>`
  : "";
writeFileSync(
  path.join(outDir, "index.html"),
  template
    .replaceAll("{{TITLE}}", relative)
    .replaceAll("{{KIND}}", kind)
    .replace("<!--palette-->", `<style>:root { ${readPaletteCss()} }</style>`)
    .replaceAll("{{RELOAD}}", reload),
);

const ctx = await context({
  entryPoints: [path.join(scriptsDir, "viewer.js")],
  outfile: path.join(outDir, "viewer.js"),
  bundle: true,
  format: "esm",
  sourcemap: "inline",
  logLevel: "info",
  tsconfig: path.join(repoRoot, "tsconfig.json"),
  alias: { "artwork-under-preview": artworkPath },
});

if (serving) {
  await ctx.watch();
  const server = await ctx.serve({
    servedir: outDir,
    host: "127.0.0.1",
    port,
  });
  console.log(`Previewing ${relative} at http://127.0.0.1:${server.port}`);
  console.log("Press Ctrl+C to stop.");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log(`Wrote ${path.join(outDir, "index.html")}`);
}
