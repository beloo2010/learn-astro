// Regression checks for the Foucault pendulum interactive.
// Run from the repo root: node lessons/u01-earth/interactive/foucault-model.test.mjs
import assert from 'node:assert/strict';
import {
  rateDegPerHour, swingBearingOnFloor, swingBearingOnScreen, floorTurnOnScreen, distanceToSwingLine, norm360, START_BEARING,
} from './foucault-model.js';

const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: expected ${b}, got ${a}`);

// North Pole, floor view: the swing turns clockwise (bearing increases) about 15° an hour.
{
  const b = swingBearingOnFloor(90, 1);
  assert.ok(b > START_BEARING, `North Pole floor view should turn clockwise, got ${b}`);
  close(b, START_BEARING + 360 / 23.934, 'North Pole rate');
  close(norm360(swingBearingOnFloor(90, 23.934)), START_BEARING, 'full circle in one star day at the pole');
}

// North Pole, stars view: the swing keeps its direction; the floor turns counterclockwise under it.
for (const h of [0, 1, 6, 12.5]) close(swingBearingOnScreen(90, h, 'stars'), START_BEARING, `stars view at the pole, ${h} h`);
assert.ok(floorTurnOnScreen(90, 1, 'stars') < 0, 'floor turns counterclockwise in the stars view at the North Pole');

// South Pole: the reverse direction.
{
  const b = swingBearingOnFloor(-90, 1);
  assert.ok(b < START_BEARING, `South Pole floor view should turn counterclockwise, got ${b}`);
  close(swingBearingOnScreen(-90, 5, 'stars'), START_BEARING, 'stars view at the South Pole');
}

// Equator: no drift in either view.
for (const frame of ['floor', 'stars']) close(swingBearingOnScreen(0, 30, frame), START_BEARING, `equator, ${frame} view`);
close(rateDegPerHour(0), 0, 'equator rate');

// Paris: about 11.3° an hour clockwise, a full circle in about 32 hours (Britannica: "more than 11° per hour").
{
  const r = rateDegPerHour(48.85);
  assert.ok(r > 11 && r < 11.5, `Paris rate ${r}`);
  const full = 360 / r;
  assert.ok(full > 31 && full < 33, `Paris full circle ${full} h`);
}

// Peg detection works at either end of the swing line.
close(distanceToSwingLine(90, 90), 0, 'peg on the line');
close(distanceToSwingLine(270, 90), 0, 'peg on the far end of the line');
close(distanceToSwingLine(0, 90), 90, 'peg at right angles');
close(distanceToSwingLine(100, 90 + 360 * 3), 10, 'after several turns');
close(distanceToSwingLine(80, -720 + 90), 10, 'after several turns the other way');

console.log('foucault-model: all checks passed');
