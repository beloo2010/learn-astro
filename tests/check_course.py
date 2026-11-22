"""Validate family trivia and generate a chapter coverage report from course files."""
import json
import re
from collections import Counter
from pathlib import Path

from jsonschema import Draft202012Validator


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def lesson_ids():
    result = set()
    for path in Path("lessons").glob("u*-*/*.md"):
        text = path.read_text(encoding="utf-8")
        front = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
        match = front and re.search(
            r"""^id:\s*["']?(u\d{2}-l\d{2})["']?\s*(?:#.*)?$""",
            front[1], re.M,
        )
        if not match or match[1] in result:
            raise ValueError(f"{path}: missing or duplicate lesson ID")
        result.add(match[1])
    return result


def validate_trivia(ids):
    validator = Draft202012Validator(load(Path("templates/trivia.schema.json")))
    seen = set()
    for path in sorted(Path("trivia").glob("*.json")):
        bank = load(path)
        for error in validator.iter_errors(bank):
            raise ValueError(f"{path} {error.json_path}: {error.message}")
        for item in bank["items"]:
            if item["lesson"] not in ids:
                raise ValueError(f"{path}: unknown lesson {item['lesson']}")
            if item["id"] in seen:
                raise ValueError(f"{path}: duplicate question {item['id']}")
            seen.add(item["id"])


def coverage(ids):
    counts = {chapter: Counter() for chapter in range(1, 31)}
    for row in load(Path("syllabus/section-map.json")):
        chapter = counts[row["chapter"]]
        if row["coverage"] not in ("core", "light", "optional"):
            raise ValueError(f"Unknown coverage level for {row['section']}")
        missing = set(row["lessons"]) - ids
        if missing:
            raise ValueError(f"Unknown lesson references for {row['section']}: {missing}")
        chapter[row["coverage"]] += 1
        chapter["covered"] += bool(row["lessons"])
    lines = ["# textbook coverage", "",
             "Covered counts sections linked to at least one existing lesson.", "",
             "| Chapter | Core | Light | Optional | Covered |",
             "| --- | ---: | ---: | ---: | ---: |"]
    for chapter, count in counts.items():
        lines.append(f"| {chapter} | {count['core']} | {count['light']} | "
                     f"{count['optional']} | {count['covered']} |")
    Path("syllabus/coverage.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    ids = lesson_ids()
    validate_trivia(ids)
    coverage(ids)
