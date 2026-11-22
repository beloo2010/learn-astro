# learn-astro

A personal astronomy course built on [OpenStax *Astronomy 2e*](https://openstax.org/details/books/astronomy-2e). It takes an adult beginner from "What is Earth?" up to high-school level and beyond, with material ready to teach to children.

It has four parts:
- **Lessons**, one concept each, in `lessons/`
- **Family trivia**, sorted by difficulty, in `trivia/`
- **Universe Sandbox walkthroughs**, verified on a real screen, in `sandbox/`
- **Sky Lab**, an interactive web tool, in `site/`

The full design is in [`PLAN.md`](PLAN.md). The agents' rules are in [`AGENTS.md`](AGENTS.md).

## Running the website locally

```bash
cd learn-astro
python3 -m http.server 8000
```

Then open <http://localhost:8000/site/> in a browser. To use a tablet on the same Wi-Fi, replace `localhost` with the computer's local IP address.

*(The website shell is being built. See the Issues labeled `owner:codex`.)*

## Resuming the course

Tell Claude **"Let us continue."** Claude reads [`course/progress.md`](course/progress.md) and picks up where you left off.

## Who does what

| Who | Role |
|---|---|
| Belu | Learner, teacher to the kids, approves plans, merges PRs |
| Claude | Lessons, trivia, Universe Sandbox walkthroughs, live tutoring, tool specs, science review |
| Codex | Website, Sky Lab code, textbook section map, automated checks |
