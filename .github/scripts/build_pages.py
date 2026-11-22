"""Copy the parts of the repo the website reads into a folder for GitHub Pages.

The site discovers lessons and trivia by reading directory listings, which
`python3 -m http.server` provides locally. GitHub Pages does not list
directories, so this script writes an index.html listing into each content
folder, in the same shape the local server produces.

Usage: python3 .github/scripts/build_pages.py <output-dir>
"""
import html
import shutil
import sys
from pathlib import Path
from urllib.parse import quote

REPO = Path(__file__).resolve().parents[2]
# Folders the site reads. journal/ is deliberately left out (AGENTS.md section 8).
FOLDERS = ["site", "lessons", "trivia"]
FILES = ["course/progress.md"]
LISTED = ["lessons", "trivia"]  # folders whose listings the site fetches


def write_listing(folder: Path) -> None:
    names = []
    for child in sorted(folder.iterdir()):
        if child.name == "index.html":
            continue
        names.append(child.name + "/" if child.is_dir() else child.name)
    links = "\n".join(
        f'<li><a href="{quote(n)}">{html.escape(n)}</a></li>' for n in names
    )
    (folder / "index.html").write_text(
        f"<!doctype html>\n<meta charset=\"utf-8\">\n<ul>\n{links}\n</ul>\n",
        encoding="utf-8",
    )


def main(out: Path) -> None:
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    for name in FOLDERS:
        shutil.copytree(REPO / name, out / name)
    for name in FILES:
        (out / name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(REPO / name, out / name)
    for name in LISTED:
        for folder in [out / name, *(p for p in (out / name).rglob("*") if p.is_dir())]:
            write_listing(folder)
    # The site lives in site/; send visitors at the root URL there.
    (out / "index.html").write_text(
        '<!doctype html>\n<meta charset="utf-8">\n'
        '<meta http-equiv="refresh" content="0; url=site/">\n'
        '<title>Family astronomy</title>\n<a href="site/">Open the course</a>\n',
        encoding="utf-8",
    )
    (out / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve())
