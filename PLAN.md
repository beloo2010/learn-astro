# Astronomy for Belu (and Family): Project Plan

**Status:** v2, approved by Belu on 2026-11-22. Revised after review by ChatGPT Codex. Pilot planned, not yet run.
**Foundation text:** [OpenStax *Astronomy 2e*](https://openstax.org/details/books/astronomy-2e), all 30 chapters.
**Agents:** Claude (Anthropic) and ChatGPT Codex (OpenAI), collaborating through this GitHub repository.

---

## 1. Goals

1. Belu goes from no background to a high-school-level understanding, and then on to deeper ideas.
2. For every concept, Belu can explain **what it is**, **why it happens**, and **how we know**, in everyday language.
3. Belu can teach each lesson to his children (about ages 7, 9, and 11), using a trivia bank and hands-on demonstrations.
4. Every lesson includes a Universe Sandbox exercise that a first-time user can complete without guessing where to click.
5. A custom interactive web tool grows with the course.
6. A lasting record shows the syllabus, progress, Belu's explanations in his own words, a revisit list, and where to resume.

## 2. Teaching principles

- **Earth first, then outward.** Each step outward answers a question the previous step raised. Tools such as light-years, spectra, and gravity are introduced at the moment a question needs them, not up front.
- **One concept per lesson.** A lesson takes about 15–25 minutes. Extra material goes in an optional "Go deeper" box.
- **Three questions in every lesson:**
  - What is it?
  - Why does it happen?
  - How do we know?
- **Accurate simple wording.** Simple statements must still be true. For example, say "The moonlight we see is sunlight bouncing off the Moon," not "moons only reflect light."
- **Honest demonstrations.** When a simulation only *illustrates* an idea (for example, things look smaller when far away), the lesson says so. It keeps that separate from real evidence (for example, sunlight and starlight show the same spectral fingerprints).

## 3. Lesson format

| Step | What happens |
|---|---|
| Warm-up | Three quick review questions from earlier lessons (spaced repetition) |
| Hook | A question a curious child might ask |
| Core idea | Two or three short chunks, each with an image or diagram. New terms are **bolded and defined** the first time they appear. |
| How do we know? | One piece of real evidence |
| Predict, then check | Belu commits to a guess before seeing the answer |
| Lab or Universe Sandbox | A guided exercise |
| Teach-back | Belu explains the idea in 2–3 sentences. Claude replies with follow-up questions a child would ask. |
| Family kit | Trivia questions plus one "show me" demonstration with household items |
| Record | Update the progress file and journal |

**Pacing rule:** If the teach-back holds up under the child-style questions, move on. If it wobbles, re-explain briefly, add the concept to the revisit list, and bring it back in future warm-ups.

## 4. Syllabus (revised)

The course has 28 units and an estimated 110–130 lessons. At three lessons a week, that is about 9–10 months, but the pace stays flexible.

**Planned first deliverable:** A section-by-section map, `syllabus/section-map.json`, generated from the textbook. It marks every OpenStax section as **core**, **light**, or **optional** and links each one to the lessons that cover it. The "optional" picks in the table below are provisional until that map exists.

| # | Unit and its big question | OpenStax sections | Provisionally optional |
|---|---|---|---|
| 1 | **What is Earth?** | 8.1–8.5, part of 4.1 | Detailed climate chemistry in 8.4 |
| 2 | **Who are our nearest neighbors?** The Sun and Moon at first glance, the planets in order, and the light-year (introduced here, just in time) | 1.3–1.7 (tour), 7.1 | none |
| 3 | **Why does the sky move?** The celestial sphere, constellations, seasons, time, and calendars | 2.1, 4.1–4.4 | Calendar history detail |
| 4 | **What is the Moon?** Phases, tides, eclipses, surface, craters, and origin | 4.5–4.7, 9.1–9.4 | none |
| 5 | **How did people figure the sky out?** How science works, ancient astronomy, Copernicus, and Galileo | 1.1–1.2, 2.2–2.4 | 2.3 Astrology and Astronomy |
| 6 | **Why don't planets fall into the Sun?** | 3.1–3.6 | 3.6 detail |
| 7 | **What is light?** | 5.1–5.6 | Atom-structure detail in 5.4 |
| 8 | **How do telescopes work?** | 6.1–6.6 | 6.3 detectors, 6.6 future telescopes |
| 9 | **What is the Sun, and why does it shine?** | 15.1–15.4, 16.1–16.4 | Relativity math in 16.2, neutrino-experiment detail |
| 10 | **What are the rocky worlds?** The solar system overview, Mercury, Venus, and Mars | 7.1–7.3, 9.5, 10.1–10.6 | Radioactive-dating detail |
| 11 | **What are the giant planets?** | 11.1–11.3 | none |
| 12 | **Moons, rings, and Pluto** | 12.1–12.5 | none |
| 13 | **What is left over from the solar system's formation?** Asteroids, comets, meteorites, and how the solar system formed | 7.4, 13.1–13.4, 14.1–14.5 | Meteorite classification |
| 14 | **How do we read starlight?** | 17.1–17.4 | B–V color index |
| 15 | **How do we sort stars?** Mass, size, and the H–R diagram | 18.1–18.4 | none |
| 16 | **How far away are the stars?** | 19.1–19.4 | Variable-star detail in 19.3 |
| 17 | **What is between the stars?** | 20.1–20.6 | 20.4 cosmic rays |
| 18 | **How are stars born?** | 21.1–21.2 | none |
| 19 | **Are there planets around other stars?** | 21.3–21.6 | none |
| 20 | **How do stars age?** | 22.1–22.5 | none |
| 21 | **How do stars die?** | 23.1–23.6 | 23.6 gamma-ray bursts |
| 22 | **What are black holes, and how does gravity bend space?** | 24.1–24.7 | 24.4 Time in General Relativity |
| 23 | **What is the Milky Way?** | 25.1–25.6 | none |
| 24 | **What other galaxies are out there?** | 26.1–26.5 | none |
| 25 | **What are quasars and supermassive black holes?** | 27.1–27.3 | 27.3 |
| 26 | **How are galaxies spread out and changing, and what is dark matter?** | 28.1–28.5 | none |
| 27 | **How did the universe begin?** | 29.1–29.7 | 29.6 inflation, 29.7 anthropic principle |
| 28 | **Are we alone?** | 30.1–30.4 | none |

*(Unit 2 is a short bridge unit.)*

### Unit 1 at lesson level (example of one-concept granularity)

1. What is Earth? (a planet: a huge ball of rock, metal, and water)
2. Where is Earth? (third planet from the Sun)
3. **What causes day and night?** (Earth spins) ← *planned pilot lesson*
4. What is inside Earth? (crust, mantle, core)
5. Why does the ground move? (plates, volcanoes, earthquakes)
6. What is an atmosphere?
7. Why is Earth called a water world? (water covers about 71% of the surface)
8. Earth's invisible shield (the magnetic field and auroras)
9. Life, air, and climate
10. Rocks from space that hit Earth (craters and the dinosaurs)

## 5. Trivia bank

- **Tiers by difficulty, not by age:** Starter, Explorer, Challenger. Any child may try any question, since a younger child often gives the best answer to a prediction question.
- **Question types:** recall, number, order, explain, predict, demonstrate.
- **Every question records** its answer, a short "why," the textbook section it comes from, and an optional follow-up.
- **Every lesson includes** at least one "show me" demonstration with household items.
- **Stored as data** in `trivia/uNN-*.json`, so the website's family quiz mode can use it.

## 6. Universe Sandbox practice

### What documentation exists, and what it means for us

- **Official in-app tutorials:** The developer's FAQ points users to Home > Guides inside the app. This is the most reliable "official" walkthrough source, and it always matches the installed version.
- **Keyboard shortcuts:** The developer's own online controls page covers only *Universe Sandbox Legacy*. For the current app, it directs users to Home > Help inside the app.
- **Community wiki:** It describes the interface, for example that right-clicking an object opens its properties panel. However, it warns that the interface changes often and may not match the latest version.
- **The interface changed recently:**
  - Update 35 added automatic panel management and a redesigned View panel.
  - Update 36 rebuilt the physics.
  - Update 36.3 (August 2026) added a Duplicate button.
  - The developer's blog has posts after that, so newer versions may exist.

**Conclusion:** No up-to-date, click-by-click public manual exists. Walkthroughs must be drafted from the sources above and then **verified on Belu's screen.**

### How each walkthrough is produced

1. **Draft:** Claude writes it from the in-app Guides, the release notes for Belu's version, and the wiki.
2. **Verify:** Belu runs it with the Claude desktop app open. Claude watches the screen through computer use (screen viewing), confirms every step, and fixes any that don't match.
3. **Record:** Each walkthrough is stamped `Verified on Universe Sandbox <version>, <date>`, with screenshots in `sandbox/`.
4. **Re-check:** After a Universe Sandbox update, verified walkthroughs are spot-checked before their next use.

### Walkthrough template

- Goal (one sentence)
- Starting point (which simulation or screen)
- Numbered steps, each giving the exact click or key and what should appear afterward
- What to look for
- What it means
- **What this can't show**, and where the custom lab or the textbook covers it instead

### Unit 0 for Universe Sandbox

Before Unit 1, a short orientation covers:

- Navigating the camera
- Pausing and changing speed
- Selecting an object and opening its properties
- Finding the in-app Guides

## 7. The custom interactive tool ("Sky Lab")

### Purpose

Universe Sandbox shows physics from space. Sky Lab covers what it doesn't:

- **The view from the ground**
- **True scale**
- **The evidence behind astronomy** (spectra, parallax, the H–R diagram)

### First module: Manor Sunrise

It has two linked views:

- **Space view:** Earth with a marker on Manor, Texas, the line between day and night, and the direction of the Sun.
- **Backyard view:** Looking east from Manor, showing the horizon and the sky changing from dark to dawn to day.

There is one control: rotate Earth (time of day). When the marker crosses into sunlight, the Sun rises in the backyard view at the same moment.

**Accuracy:** Sun positions come from **Astronomy Engine**, an open-source library (MIT license), rather than hand-written math. An automated test checks that the computed sunrise time for Manor matches published U.S. Naval Observatory times within 2 minutes.

**Later controls, added only when the course reaches them:**

- The date → seasons and day length
- The Moon → phases and eclipses

### Later modules

| Unit | Module |
|---|---|
| 2 | Scale Ladder |
| 6 | Orbit Lab (Kepler's laws) |
| 7 | Light Lab (prisms, temperature and color) |
| 15 and 20 | Star Lab (H–R diagram and star evolution) |
| 16 | Distance Ladder (parallax) |
| 24 and 27 | Expanding Universe |

### Other parts of the website

- **Course map:** progress through the syllabus
- **Lesson pages**
- **Family quiz mode:** built on the trivia data
- **Journal view**

## 8. Technical approach

- **A static website:** plain HTML, CSS, and JavaScript modules, with **no build step**.
  - Libraries (Astronomy Engine, three.js for 3D) are stored in the repository, so everything works offline.
  - To use it, run a one-line local web server, such as `python3 -m http.server`, and open `localhost` in a browser. It works on a laptop or tablet on the home network.
  - It can be published with GitHub Pages later if Belu wants a link. (Pages on a private repository requires a paid GitHub plan.)
- **Content is plain files:** lessons in Markdown, trivia in JSON. The site reads them, so content and code stay separate.
- **Automated checks (GitHub Actions):**
  - Trivia files are checked against a schema.
  - Links are checked.
  - A **coverage report** lists which textbook sections are covered by lessons and which remain optional.
  - Tool tests (such as the sunrise accuracy test) run automatically.
- **The repository stays private,** because it contains the family journal.

### Repository layout

```
README.md            how to run the site; how to say "Let us continue"
AGENTS.md            shared rules for both agents (Codex reads this automatically)
CLAUDE.md            points to AGENTS.md
PLAN.md              this file
syllabus/            syllabus.md, section-map.json
lessons/uNN-*/       one Markdown file per lesson
trivia/              uNN-*.json
sandbox/uNN-*/       Universe Sandbox walkthroughs + screenshots
course/progress.md   checklist, "resume here" pointer, revisit list
journal/             "In my own words" entries, one per lesson
site/                the web app (Sky Lab, course map, quiz)
tests/  .github/     automated checks
```

## 9. Division of work between Claude and Codex

Each area has a single owner, so the two agents never edit the same files at the same time. The other agent reviews every change.

| Area | Owner | Reviewer | Why |
|---|---|---|---|
| Repo setup, website shell, lesson and trivia display, family quiz mode, course map | **Codex** | Claude | Repository-centered building and testing is Codex's strength |
| Sky Lab modules (code) | **Codex** | Claude (science and teaching) | Same reason; Claude writes the spec and acceptance tests for each module first |
| Section map from the textbook PDF; coverage report; schema and CI checks | **Codex** | Claude | Structured data extraction plus automation |
| Lesson content (explanations, "How do we know?", misconceptions, links) | **Claude** | Codex (clarity and fact check) | Teaching writing and scientific explanation |
| Trivia banks | **Claude** | Codex (schema and accuracy) | Drawn directly from the lesson content |
| Universe Sandbox walkthroughs | **Claude** | Belu (live) | Claude can watch Belu's screen through the desktop app to verify steps; Codex cannot |
| Live tutoring: teach-back, child-style questions, pacing, progress and journal updates | **Claude** | none | Conversational and adaptive |
| Tool specifications and science accuracy reviews | **Claude** | Codex (feasibility) | Defines what each tool must teach and the values it must match |
| Approving plans and merging changes | **Belu** | none | The final decision-maker |

Codex has the larger share of the building work. Claude has the teaching, the content, and live sessions with Belu.

### Working agreement

- **GitHub is the shared memory.** The agents never talk directly; Belu starts each one.
- Tasks are tracked as **GitHub Issues** labeled `owner:claude` or `owner:codex`.
- Work happens on branches named `claude/...` or `codex/...` and arrives as a **pull request**.
- **The other agent reviews each pull request, and Belu merges it.**
- `AGENTS.md` holds the rules: file ownership, the trivia schema, the lesson template, wording standards, and the requirement that every factual claim cites an OpenStax section or another reliable source.
- Each pull request description ends with a **handoff note** saying what changed, what to check, and what comes next.
- Every session begins by reading `course/progress.md` and the open issues.

## 10. "Let us continue"

When Belu says **"Let us continue,"** Claude:

1. Reads `course/progress.md`.
2. Runs the warm-up questions.
3. Teaches the next lesson.
4. Records the teach-back in `journal/`.
5. Updates the checklist, the revisit list, and the resume pointer.
6. Commits the changes.

## 11. Next steps (after approval)

1. ~~Belu creates the private repository~~ (done: `beloo2010/learn-astro`). Belu grants Claude and Codex access to it.
2. Claude commits this plan, `AGENTS.md`, and the templates. Codex sets up the website shell and builds the section map.
3. Claude writes the pilot lesson ("What causes day and night?") and the Manor Sunrise specification. Codex builds the Manor Sunrise module.
4. **Pilot test.** Belu can:
   - (a) explain day and night in his own words,
   - (b) complete the Universe Sandbox exercise without guessing (verified live on his screen), and
   - (c) ask the children several good questions drawn from the lesson.
5. If the pilot passes, the course continues. If not, the format is adjusted before more lessons are written.
