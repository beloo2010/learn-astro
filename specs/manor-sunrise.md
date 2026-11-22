---
module: manor-sunrise
status: draft              # draft | reviewed | built | accepted
lesson: u01-l03            # "What causes day and night?" (pilot)
owner_spec: Claude
owner_code: Codex          # issue #4
---

# Sky Lab spec: Manor Sunrise

## 1. Learning goal

After using this module for about five minutes, Belu (and the children) can say in their own words:

> "Sunrise is not the Sun climbing up. It is the moment our spot on the spinning Earth turns into the sunlight."

The module supports lesson **u01-l03, *What causes day and night?*** It does this by showing **one event from two places at once**: from space (Manor turning into the sunlight) and from the backyard (the Sun appearing over the eastern horizon).

### Misconceptions it should help correct

| Misconception | How the module answers it |
|---|---|
| "The Sun goes around Earth every day." | The Sun's direction never changes in the space view. Only Earth turns. The backyard Sun still appears to move, so the child sees both at once. |
| "At night the Sun goes behind something, or turns off." | The space view shows the Sun shining the whole time, with half of Earth always lit. |
| "Sunrise happens everywhere at the same moment." | The lit and dark halves are visible together, so places to the east of Manor are already in daylight when Manor is dark. |

### Honesty note (required by `AGENTS.md` §4)

This module is an **illustration, not evidence**. It shows what a spinning Earth *would* look like. The lesson's "How do we know?" section supplies the real evidence (for example, a Foucault pendulum and photos of Earth from space). The module must display a one-line caption to that effect (see §4.4).

## 2. Scope

### In version 1

- Two linked views: **Space view** and **Backyard view**.
- **One control: time of day** (a slider, plus a Play/Pause button that moves the same slider).
- The date is fixed for a session: today's date in Manor, unless a `date` URL parameter is given (§5.3). There is **no date control in the UI** in version 1.

### Not in version 1 (added only when the course reaches them, per `PLAN.md` §7)

- A date control (seasons and day length).
- The Moon (phases and eclipses).
- A "turn around and look west" control for sunset.
- Other locations.

## 3. Fixed values

| Value | Setting | Source |
|---|---|---|
| Location | Manor, Texas: **latitude 30.3408° N, longitude 97.5569° W** | Wikipedia lists 30.3431° N, 97.5567° W ([Manor, Texas](https://en.wikipedia.org/wiki/Manor,_Texas)). The value used here is about 250 m south of that. It is the exact point the reference times in §6 were requested for, so tests and data match. The difference changes sunrise by well under one second. |
| Elevation | 0 m in calculations (the actual elevation is about 162 m, or 531 ft) | Matches the U.S. Naval Observatory (USNO) convention for rise and set times, which ignores elevation. |
| Time zone | `America/Chicago` (CST, UTC−6; CDT, UTC−5 during daylight saving time) | |
| Definition of sunrise | The moment the **top edge of the Sun** appears on a flat, clear horizon. In **geometric** terms (no atmosphere), this is when the Sun's center is **0.8333° below** the horizon: 34′ for atmospheric refraction plus 16′ for the Sun's radius are already folded into that number. | USNO, [Rise, Set, and Twilight Definitions](https://aa.usno.navy.mil/faq/RST_defs) |
| Twilight | Defined by the Sun's **geometric** center altitude: civil twilight from −0.8333° (sunrise or sunset) to −6°, nautical to −12°, astronomical to −18° | Same source |
| Two kinds of altitude | **Geometric altitude** (Astronomy Engine `Horizon(..., refraction omitted)`): used for every threshold, including twilight bands and daylight. **Apparent altitude** (`Horizon(..., "normal")`, refraction included): used **only** to place the Sun disk in the Backyard view. Never compare apparent altitude with −0.8333°: that would count refraction twice. | |
| Sun positions | **Astronomy Engine** (MIT license), vendored in `site/vendor/` with its license. Use its `SearchRiseSet`, `SearchHourAngle`, `Equator`, and `Horizon` functions. No hand-written solar formulas (`AGENTS.md` §7). | [Astronomy Engine](https://github.com/cosinekitty/astronomy) |

## 4. Layout and interaction

### 4.1 Overall layout

- **Landscape (laptop, or tablet held sideways, about 1024 px wide):** Space view on the left, Backyard view on the right, about 50/50. The time control runs full width underneath.
- **Portrait (narrower than about 800 px):** Space view on top, Backyard view below, control at the bottom.
- Everything must fit on one screen with no scrolling at 1024 × 768.

### 4.2 Space view

- **Earth** as a globe, with simple continent outlines or a texture, so North America can be found.
- **Camera:** fixed in a frame tied to Earth's axis (it does **not** turn with Earth). It looks down at Earth from **70° above the equator**, with the North Pole near the top centre of the globe. From there, Manor (latitude 30.3° N) is on the visible side of the globe at every hour: at the point of its daily turn farthest from the camera, it is still about 10° of arc in from the globe's edge. The day/night line is also visible all day.
- **Axis tilt:** shown by placing the Sun's direction at its declination for the date (from Astronomy Engine). In December the sunlight comes from slightly south of the equator's plane, so the North Pole region is dark all day; in June the reverse. This sets where the day/night line falls.
- **Fallback:** if a different camera is chosen in the build, Manor must never disappear. When it is on the far side of the globe, draw it as a hollow outline with a dashed leader line, and keep its label. Manual test M8 checks this.
- **The Sun's direction:** a labelled arrow, or a small Sun icon at the edge of the view with sunlight rays. Label: "Sunlight comes from this way". The Sun is **not** drawn to scale. Add a small note: "The real Sun is about 150 million km (93 million miles) away." (Source: [NASA Sun facts](https://science.nasa.gov/sun/facts/).)
- **Day and night:** the half of Earth facing the Sun is lit, and the other half is dark. The boundary is drawn as a clear line or a soft band. The boundary comes from the Sun's position for the current moment (from Astronomy Engine), so it is correct for the date.
- **Manor marker:** a bright pin or dot with the label "Manor (you are here)". Its colour or icon changes when Manor is in daylight versus darkness, using the **same test as the Backyard view** (§4.5).
- **Rotation direction:** a small curved arrow near the North Pole showing Earth spins **west to east (counterclockwise seen from above the North Pole)**. (Source: OpenStax *Astronomy 2e* 4.1.)

### 4.3 Backyard view

- **Direction:** facing **east**. A simple ground silhouette (grass, a fence, or a tree line) along the bottom.
- **Field of view:** at least **azimuth 50° to 130°** (northeast to southeast) and **altitude −5° to +35°**. This keeps the sunrise point in view on every date of the year: the Sun rises at about azimuth 62° in late June and about 117° in late December at Manor (computed with Astronomy Engine; see §6). Compass labels along the horizon: **NE, E, SE**.
- **The Sun disk:** placed at the computed azimuth and **apparent** altitude. The disk may be drawn larger than life, so anchor it by its **top edge**: the top edge is drawn at apparent altitude + 0.2667° (the Sun's real angular radius), and the rest of the disk hangs below that. At the sunrise instant from §4.5, this puts the top edge on the horizon (within 0.1°, or 2 px, whichever is larger). Only draw the disk on or after sunrise and before sunset, so it never shows above the horizon while the scene says night.
- **When the Sun is out of view** (between sunrise and sunset, but outside the field of view):
  - Before solar noon: a small arrow at the edge of the view nearest the Sun, labelled "The Sun is up here".
  - After solar noon: the label "The Sun is behind you, in the west".
  - Before sunrise or after sunset: no label. The sky colour shows it.
- **Sky colour** depends only on the Sun's **geometric** altitude *h* (the Sun's center, in degrees, no refraction), plus the shared rise and set events:

  | Sun altitude | Sky | On-screen label |
  |---|---|---|
  | *h* < −18° | Night: dark, with a few stars | Night |
  | −18° ≤ *h* < −6° | Deep blue, brightening toward the east | Early dawn |
  | −6° ≤ *h*, before sunrise | Civil twilight: bright blue, orange glow at the eastern horizon | Dawn |
  | From sunrise to sunset (`isManorLit` is true) | Day: blue sky | Day (and "Sunrise!" for a few seconds of animation after crossing) |

  The Day row uses the rise and set **events** (§4.5), not a separate altitude test, so the label, the disk, and the globe marker cannot disagree. Colour changes should blend smoothly within each band, but the label must switch exactly at the thresholds. The same bands apply in the evening, with "Dusk" in place of "Dawn" and "Late dusk" in place of "Early dawn".

### 4.4 Readouts and captions

- **Clock:** local time in Manor with the zone, for example `6:52 AM CST`.
- **Date:** for example `Sunday, November 22, 2026`.
- **Today's sunrise:** for example `Sunrise today: 7:04 AM`. Shown all the time.
- **Countdown:** before sunrise, `Sunrise in 23 minutes`; after sunrise, `The Sun rose 15 minutes ago`. After noon, hide it.
- **Honesty caption** (small, always visible): "This is a picture of the idea, not proof. See 'How do we know?' in the lesson."

### 4.5 The link between the views (the core requirement)

Both views are driven by **one shared moment in time, *t***. The session date has **one sunrise event and one sunset event**, each computed once with Astronomy Engine `SearchRiseSet` (which uses the USNO geometric −0.8333° definition from §3). Manor is in daylight when *sunrise ≤ t < sunset*. That single rule, `isManorLit(t)`, decides:

- the globe marker's day or night state,
- whether the backyard Sun disk is drawn,
- the "Day" label and the "Sunrise!" animation, and
- the countdown in §4.4.

So at the instant *t* crosses sunrise, all four change **in the same frame**. The disk's top edge is on the horizon in that frame because of the anchoring rule in §4.3.
- The drawn day/night line on the globe is geometric. It may sit up to about 1° of Earth's rotation (about 4 minutes) away from the marker's switch, because of refraction and the Sun's size. That is too small to notice at globe scale. The marker's state, not the drawn line, is what must match the Backyard view exactly.

### 4.6 The time control

- **Slider:** covers the full day, from 00:00 to 24:00 local time on the session date. On a daylight saving changeover date, the slider covers the real 23 or 25 hours.
- **Starting position:** 45 minutes before today's sunrise, so the first thing seen is darkness turning into dawn.
- **Step:** 1 minute. Arrow keys move 1 minute; Page Up and Page Down move 15 minutes.
- **Touch:** the slider handle has a touch target of at least 44 × 44 px. Dragging must update both views smoothly. Starting target: 30 frames per second. The real number is measured on Belu's tablet during M5 and recorded in the PR; if it falls short, Claude and Codex agree a revised target in the PR rather than blocking the build.
- **Play/Pause:** moves the slider forward at **1 hour of simulated time per 4 seconds** of real time. Play stops automatically at 24:00. Touching the slider pauses playback.
- **Tick marks** on the slider at midnight, sunrise, noon (solar transit), and sunset, labelled with times. The sunrise tick is the most visible.

## 5. Technical requirements

### 5.1 Code

- Plain HTML, CSS, and ES modules, no build step, following `AGENTS.md` §7. Use three.js (vendored) for the globe if needed. A 2D canvas drawing for the Backyard view is fine.
- Must work offline, from `python3 -m http.server` at the repo root.

### 5.2 Separate the model from the drawing

So the accuracy tests can run in Node without a browser, put all astronomy in a module with no DOM access. The path and names are Codex's choice. It must provide these functions, or close equivalents named in the PR:

| Function | Returns |
|---|---|
| `sunriseFor(dateString)` | The sunrise instant (a JS `Date`) for the given local calendar date (`"YYYY-MM-DD"`) in Manor, or `null` if none |
| `sunsetFor(dateString)` | Same, for sunset |
| `solarNoonFor(dateString)` | The Sun's upper transit for that date |
| `sunAt(date)` | `{ altitude, apparentAltitude, azimuth }` in degrees for an instant. `altitude` is geometric (no refraction) and is the only altitude used in thresholds. `apparentAltitude` includes refraction and is used only to draw the disk. |
| `skyPhase(date)` | One of `"night"`, `"early-dawn"`, `"dawn"`, `"day"`, `"dusk"`, `"late-dusk"`. Uses `isManorLit(date)` for `"day"`, and geometric altitude with the −6° and −18° thresholds in §4.3 otherwise. Before solar noon gives the dawn names; after gives the dusk names. |
| `isManorLit(date)` | `true` when `sunriseFor(day) ≤ date < sunsetFor(day)` for that local day. **Both views must call this one function.** |
| `subsolarPoint(date)` | `{ lat, lon }` of the point directly under the Sun, for drawing the globe |

### 5.3 URL parameters (for testing and for lessons)

- `?date=YYYY-MM-DD` sets the session date. Without it, use today's date in Manor.
- `?time=HH:MM` sets the starting slider position (local time).
- Invalid values are ignored, and the defaults are used.

## 6. Accuracy targets and reference data

**Target:** for every date in the table below, `sunriseFor` must be within **2 minutes** of the USNO time.

**Reference values (USNO):** requested from the USNO Astronomical Applications API (`/api/rstt/oneday`, coords `30.3408,-97.5569`, `tz=-6`, `dst=true`) on 2026-11-22. USNO rounds to the nearest minute. Astronomy Engine values (computed on the same date with `astronomy-engine` 2.1.19, elevation 0) are shown for comparison. They agree with USNO to within 30 seconds on every date.

| Date | Why this date | USNO sunrise | Astronomy Engine sunrise | Sunrise azimuth | USNO sunset | USNO solar noon | USNO civil twilight begins |
|---|---|---|---|---|---|---|---|
| 2026-12-21 | Winter solstice | 07:23 CST | 07:22:45 | 116.9° | 17:34 CST | 12:28 CST | 06:56 CST |
| 2027-01-15 | Midwinter, in standard time | 07:28 CST | 07:27:32 | 114.1° | 17:52 CST | 12:40 CST | 07:02 CST |
| 2027-03-20 | March equinox (after the DST change) | 07:34 CDT | 07:34:11 | 89.7° | 19:42 CDT | 13:38 CDT | 07:10 CDT |
| 2027-06-21 | Summer solstice | 06:29 CDT | 06:28:52 | 62.0° | 20:35 CDT | 13:32 CDT | 06:01 CDT |
| 2027-09-23 | September equinox | 07:19 CDT | 07:19:02 | 89.6° | 19:26 CDT | 13:23 CDT | 06:55 CDT |
| 2027-11-08 | Just after the DST change | 06:50 CST | 06:50:02 | 108.8° | 17:38 CST | 12:14 CST | 06:25 CST |

Store this table as test data (for example `tests/data/manor-sunrise-usno.json`), including the source URL pattern and the date it was retrieved.

**Teaching note** (for the lesson, not the module): the equinox rows show the Sun rising almost exactly due east (azimuth about 90°). In June it rises well north of east and in December well south of east. That supports a later lesson on seasons.

## 7. Acceptance tests

Codex's PR for issue #4 must show each test passing, or explain why it can't be automated and how it was checked by hand.

### Automated (Node, run in CI)

| # | Test | Pass condition |
|---|---|---|
| A1 | Sunrise accuracy | For each date in §6, `|sunriseFor(date) − USNO sunrise| ≤ 2 min` |
| A2 | Sunset and solar noon accuracy | Same tolerance for `sunsetFor` and `solarNoonFor` against the §6 values |
| A3 | Time zone handling | Each result is reported in the correct zone: CST on 2026-12-21, 2027-01-15, and 2027-11-08; CDT on the other three |
| A4 | One rule for both views | For each §6 date, `isManorLit` is `false` 1 second before `sunriseFor(date)` and `true` at it; `true` 1 second before `sunsetFor(date)` and `false` at it |
| A5 | Sky phase thresholds | On 2027-03-20, using `SearchAltitude` to find the instants when geometric altitude crosses −18° and −6°, `skyPhase` changes phase within 1 second of each crossing, morning and evening. It returns `"day"` exactly from sunrise to sunset. |
| A5b | No double refraction | For each §6 date, at `sunriseFor(date)`: geometric `altitude` is within 0.01° of −0.8333°, and `apparentAltitude` + 0.2667° is within 0.1° of 0° (the top edge sits on the horizon). For reference, Astronomy Engine 2.1.19 gives −0.834° and −0.216° on 2027-03-20. |
| A6 | Sun azimuth at sunrise | `sunAt(sunriseFor(date)).azimuth` is within 1° of the §6 azimuth for each date |
| A7 | Subsolar point sanity | At USNO solar noon on 2027-03-20, `subsolarPoint` longitude is within 0.5° of −97.56° and latitude within 0.5° of 0° |
| A8 | URL parameters | `?date=2027-06-21&time=06:00` loads that date and time; `?date=nonsense` falls back to today |

### Manual (recorded in the PR with a screenshot or short screen recording)

| # | Check | Pass condition |
|---|---|---|
| M1 | Linked sunrise | With `?date=2027-03-20`, drag the slider slowly across 07:34. The Space-view marker switches to daylight in the same frame that the backyard Sun's top edge touches the horizon. |
| M2 | Sun stays put | Drag through a whole day. The Sun arrow in the Space view does not move. Earth turns counterclockwise as seen from above the North Pole. |
| M3 | Sunrise point stays in view | With `?date=2026-12-21` and `?date=2027-06-21`, the backyard Sun is visible on the horizon at sunrise (SE side in December, NE side in June). |
| M4 | Out-of-view labels | With `?date=2027-03-20`: at 11:00 CDT (Sun at azimuth about 122°, altitude about 42°, above the view) the "The Sun is up here" arrow appears at the top edge. At 17:00 CDT (azimuth about 248°, altitude about 33°) "The Sun is behind you, in the west" appears. |
| M5 | Tablet | On a tablet in landscape at about 1024 px, both views and the slider fit without scrolling, and dragging the slider with a finger is smooth. |
| M6 | Offline | With the network turned off, the module loads and works from `python3 -m http.server`. |
| M7 | Readouts | The clock, date, today's sunrise, the countdown, and the honesty caption are all visible and correct. |
| M8 | Manor always visible | For each §6 date, drag through all 24 hours. The Manor marker and its label stay visible on the globe the whole time. |

### Teaching check (Claude, at review)

| # | Check |
|---|---|
| T1 | A first-time user can find Manor and the Sun's direction within 10 seconds without help. |
| T2 | Every on-screen word is understandable to a 9-year-old. Terms not yet defined in the course (for example "azimuth" or "civil twilight") do not appear on screen. |
| T3 | Nothing on screen suggests the Sun moves around Earth. |

## 8. Sources

- OpenStax *Astronomy 2e*, section 4.1 (Earth and Sky): Earth's rotation causes the daily motion of the Sun across the sky.
- U.S. Naval Observatory, [Rise, Set, and Twilight Definitions](https://aa.usno.navy.mil/faq/RST_defs).
- U.S. Naval Observatory, [Astronomical Applications API](https://aa.usno.navy.mil/data/api), endpoint `rstt/oneday`, retrieved 2026-11-22.
- Don Cross, [Astronomy Engine](https://github.com/cosinekitty/astronomy), MIT license, version 2.1.19.
- NASA, [Sun facts](https://science.nasa.gov/sun/facts/) (distance to the Sun).
- Wikipedia, [Manor, Texas](https://en.wikipedia.org/wiki/Manor,_Texas) (coordinates and elevation).
