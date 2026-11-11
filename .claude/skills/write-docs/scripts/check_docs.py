#!/usr/bin/env python3
"""Checks Markdown documentation for broken links, missing paths and style slips.

    python3 .claude/skills/write-docs/scripts/check_docs.py [--removed PATH ...] [FILE_OR_DIR ...]

Without arguments it checks README.md, CLAUDE.md, docs/ and every Markdown file
under .claude/skills/. Run it from the repository root.

It reports
  - relative Markdown links whose target does not exist,
  - backticked repository paths that do not exist,
  - em dashes,
  - mentions of files that were removed (pass them with --removed).

Links and paths inside code fences and inline code are ignored, because examples
often use placeholder paths. Exit status is 1 when anything is reported.
"""
import re
import sys
from pathlib import Path

root = Path.cwd()
args = sys.argv[1:]
removed: list[str] = []
targets: list[str] = []
while args:
    arg = args.pop(0)
    if arg == "--removed":
        removed.append(args.pop(0))
    else:
        targets.append(arg)

if not targets:
    targets = ["README.md", "CLAUDE.md", "docs", ".claude/skills"]

files: list[Path] = []
for target in targets:
    path = root / target
    if path.is_dir():
        files += sorted(path.rglob("*.md"))
    elif path.is_file():
        files.append(path)

top_level = {p.name for p in root.iterdir() if p.is_dir() and p.name != "node_modules"}
placeholder = re.compile(r"[<>*{}\[\]$]")
problems = 0


def report(file: Path, message: str) -> None:
    global problems
    problems += 1
    print(f"{file.relative_to(root)}: {message}")


for file in files:
    text = file.read_text(encoding="utf-8")
    prose = re.sub(r"```.*?```", "", text, flags=re.S)
    links_text = re.sub(r"`[^`\n]+`", "", prose)

    for match in re.finditer(r"\]\((?!https?:|mailto:|#)([^)#\s]+)(?:#[^)]*)?\)", links_text):
        target = (file.parent / match.group(1)).resolve()
        if not target.exists():
            report(file, f"broken link {match.group(1)}")

    for match in re.finditer(r"`([A-Za-z0-9_.][A-Za-z0-9_./-]*/[A-Za-z0-9_./-]*)`", prose):
        candidate = match.group(1).rstrip("/")
        if placeholder.search(candidate) or candidate.split("/")[0] not in top_level:
            continue
        if not (root / candidate).exists():
            report(file, f"path does not exist: {candidate}")

    if "—" in text:
        report(file, f"{text.count(chr(0x2014))} em dash(es)")

    for name in removed:
        if name in text:
            report(file, f"mentions removed file {name}")

print("No problems found." if not problems else f"{problems} problem(s) found.")
sys.exit(1 if problems else 0)
