# AGENTS.md: Rules for every AI agent working in this repo

This repo is a personal astronomy course for Belu (an adult beginner) and his children (about ages 7, 9, and 11).
Two agents work here: **Claude** (Anthropic) and **ChatGPT Codex** (OpenAI). **Claude** is also the merge owner. **Belu** sets direction and decides scope changes.
Read `PLAN.md` for the full design. This file holds the working rules.

## 1. Start of every session

1. Read `course/progress.md` (resume pointer, revisit list).
2. Read the open GitHub Issues that carry your `owner:` label.
3. Read the handoff note in the most recent merged PR.

## 2. Ownership (one owner per path; the other agent reviews)

| Path | Owner | Reviewer |
|---|---|---|
| `site/` (website shell, Sky Lab code, quiz mode, course map) | Codex | Claude (science and teaching) |
| `tests/`, `.github/` (CI, schema checks, coverage report) | Codex | Claude |
| `syllabus/section-map.json` (generated from the textbook) | Codex | Claude |
| `syllabus/syllabus.md`, `lessons/`, `trivia/` | Claude | Codex (clarity, fact check, schema) |
| `sandbox/` (Universe Sandbox walkthroughs) | Claude | Belu (verified live) |
| `specs/` (Sky Lab module specs and acceptance tests) | Claude | Codex (feasibility) |
| `course/`, `journal/` (progress and Belu's teach-backs) | Claude | none |
| `PLAN.md`, `AGENTS.md`, `templates/` | Shared: change only through a PR | The other agent; Belu for scope changes |

Do not edit a path you don't own. If you need a change there, open an Issue labeled with the owner.

## 3. Branches, PRs, and Issues

- Branches: `claude/<short-topic>` or `codex/<short-topic>`.
- One topic per PR. Keep PRs small enough to review in one sitting.
- Never push to `main`. All changes arrive by PR.
- **Claude merges all PRs** (squash merge), following the merge rules below.
- Issues are labeled `owner:claude` or `owner:codex`, plus one of `content`, `tool`, `infra`, `sandbox`, `review`.
- Every PR description ends with a **Handoff** section:

  ```
  ## Handoff
  - Changed: ...
  - Please check: ...
  - Next: ...
  ```

## 3a. Review and merge rules

**Codex PRs:** Claude reviews them. Claude merges once the PR meets its issue's acceptance criteria and its checks pass. If changes are needed, Claude leaves a PR comment listing exactly what to fix, and Codex pushes fixes to the same branch.

**Claude PRs:** Codex reviews them in its next session and leaves a comment that starts with `Reviewed:` or `Changes requested:`. Claude merges after a `Reviewed:` comment. Exceptions, which Claude may merge without waiting for Codex:
- Small fixes, such as typos, links, or deleting files that are no longer needed
- `course/` and `journal/` updates from live tutoring sessions
- Universe Sandbox walkthroughs verified live with Belu

**Escalate to Belu instead of merging** when a PR:
- Changes the course scope, the unit order, or the division of work
- Deletes lessons, trivia, or journal content
- Adds a paid service, external account, or new data leaving the repo
- Has an unresolved disagreement between the two agents

Claude tells Belu what it merged in its session summary.

## 4. Content standards (lessons and trivia)

- **One concept per lesson.** Target 15–25 minutes. Extra material goes in a "Go deeper" box.
- Each lesson answers **What is it? / Why does it happen? / How do we know?**
- **Define every new term in bold** the first time it appears in the course.
- **Simple must still be true.** Good: "The moonlight we see is sunlight bouncing off the Moon." Bad: "Moons only reflect light."
- **Illustration is not evidence.** If a simulation only illustrates an idea, say so, and put real evidence in "How do we know?"
- **Cite every factual claim**: an OpenStax section (e.g., `OpenStax 8.1`), or NASA or another reliable source with a link.
- Numbers: give rounded values with units, in both metric and US units where a child would care (e.g., "about 150 million km (93 million miles)").
- Use the templates in `templates/`.

## 5. Trivia data

- One file per unit: `trivia/uNN-<slug>.json`, following `templates/trivia.schema.json`.
- Difficulty tiers: `starter`, `explorer`, `challenger`. Tiers describe difficulty, not age.
- Types: `recall`, `number`, `order`, `explain`, `predict`, `demonstrate`.
- Every lesson has at least one `demonstrate` item that uses household objects.

## 6. Universe Sandbox walkthroughs

- No complete, current public manual exists. Draft from the in-app Guides (Home > Guides), the release notes, and the community wiki.
- Mark any step not yet confirmed on Belu's screen with **[unverified]**.
- After live verification, stamp the file: `Verified on Universe Sandbox <version>, <date>`.
- Every walkthrough ends with **"What this can't show."**

## 7. Code standards (site/)

- Static site: plain HTML, CSS, and ES modules. **No build step.** Runs from `python3 -m http.server` at the repo root.
- Third-party libraries are stored in `site/vendor/` with their license files (offline use).
- Astronomical positions come from **Astronomy Engine**, never hand-rolled formulas.
- Each Sky Lab module must pass the acceptance tests in its spec in `specs/`.
- The site must work on a tablet browser (touch, around 1024 px wide) and a laptop.

## 8. Privacy

- The repo is private. `journal/` contains Belu's own words. Do not copy journal content into public places.
- Never commit children's names, school names, or photos.
