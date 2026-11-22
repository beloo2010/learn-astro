# Initial Issues (to be opened on GitHub)

Each `##` heading below becomes one GitHub Issue. Delete this file once the issues exist.

---

## [codex] Website shell: course map, lesson viewer, quiz mode skeleton
**Labels:** owner:codex, infra

Build the static site in `site/` according to `AGENTS.md` section 7: no build step, served by `python3 -m http.server` from the repo root.

**Acceptance criteria**
- `site/index.html` is the home page, with links to: Course map, Lessons, Sky Lab, Family quiz.
- **Course map:** reads `course/progress.md` (or a JSON file generated from it) and shows units and lessons with done / next / not-started states.
- **Lesson viewer:** renders any `lessons/uNN-*/*.md` file, including front matter, `<details>` blocks, and images. Use a small vendored Markdown library.
- **Quiz mode skeleton:** loads `trivia/*.json`, filters by unit, lesson, and tier, shows one question at a time with tap-to-reveal answer and "why", and has a "pass to next player" button. No scoring needed yet.
- Works on a tablet (touch, about 1024 px) and a laptop. Readable, large type, child-friendly but not babyish.
- `README.md` run instructions still work unchanged.

---

## [codex] Section map from OpenStax Astronomy 2e
**Labels:** owner:codex, infra

Generate `syllabus/section-map.json` from the textbook ([PDF](https://assets.openstax.org/oscms-prodcms/media/documents/astronomy-2e_-_WEB.pdf), or the web table of contents).

**Format**
```json
[{ "section": "8.1", "title": "The Global Perspective", "chapter": 8,
   "url": "https://openstax.org/books/astronomy-2e/pages/8-1-the-global-perspective",
   "unit": 1, "coverage": "core", "lessons": [] }]
```
- Include **every** numbered section of all 30 chapters.
- Fill `unit` from `PLAN.md` section 4. Leave `coverage` as `"core"` by default, and `"optional"` where PLAN.md says "provisionally optional". Claude will review and refine these.
- Leave `lessons` empty. Claude fills it as lessons are written.

---

## [codex] CI: trivia schema check, link check, coverage report
**Labels:** owner:codex, infra

A GitHub Actions workflow on every PR that:
1. Validates every `trivia/*.json` against `templates/trivia.schema.json`, and checks that each `lesson` id exists in `lessons/`.
2. Checks links in `*.md` files (external links: warn only).
3. Writes a **coverage report** (`syllabus/coverage.md`) from `section-map.json`: per chapter, the counts of core, light, optional, and covered-by-a-lesson sections.

---

## [codex] Sky Lab: Manor Sunrise module (after Claude's spec lands)
**Labels:** owner:codex, tool

Blocked until `specs/manor-sunrise.md` is merged. Build it to the spec. Use Astronomy Engine (vendored, MIT license) and three.js if needed for the globe.

---

## [claude] Pilot lesson: "What causes day and night?"
**Labels:** owner:claude, content

`lessons/u01-earth/u01-l03-day-and-night.md`, its trivia items in `trivia/u01-earth.json`, and its walkthrough in `sandbox/u01-l03.md` (unverified until a live check).

---

## [claude] Spec: Manor Sunrise module
**Labels:** owner:claude, tool

`specs/manor-sunrise.md`: learning goal, interactions, layout, accuracy targets (sunrise time for Manor, TX, within 2 minutes of U.S. Naval Observatory values on test dates), and acceptance tests.

---

## [claude] Universe Sandbox orientation (Unit 0)
**Labels:** owner:claude, sandbox

`sandbox/u00-orientation.md`: camera, pause and speed, selecting an object, opening properties, in-app Guides. Drafted from documentation, then verified live on Belu's version.
