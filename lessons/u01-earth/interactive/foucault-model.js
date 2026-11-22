// Angle model for the Foucault pendulum interactive. Pure functions, so they can be tested with Node.
// Bearings are compass bearings in degrees: 0 = north, 90 = east, increasing clockwise seen from above.

export const SIDEREAL_DAY_H = 23.934; // one spin of Earth against the stars, in hours (OpenStax 4.3)
export const START_BEARING = 90;      // the swing starts pointing east-west

/** How fast the swing turns over the floor, in degrees per hour. Positive = clockwise from above (north of the equator). */
export function rateDegPerHour(latDeg) {
  return 360 * Math.sin(latDeg * Math.PI / 180) / SIDEREAL_DAY_H;
}

/** The swing's bearing measured against the floor (what visitors see). */
export function swingBearingOnFloor(latDeg, hours) {
  return START_BEARING + rateDegPerHour(latDeg) * hours;
}

/**
 * How far the floor has turned on screen in the chosen view, in degrees clockwise.
 * "floor" view: the floor stays still. "stars" view: the floor turns counterclockwise (north of the equator)
 * under a swing that keeps its direction.
 */
export function floorTurnOnScreen(latDeg, hours, frame) {
  return frame === 'stars' ? -rateDegPerHour(latDeg) * hours : 0;
}

/** The swing's bearing as drawn on screen in the chosen view. */
export function swingBearingOnScreen(latDeg, hours, frame) {
  return swingBearingOnFloor(latDeg, hours) + floorTurnOnScreen(latDeg, hours, frame);
}

/** Angle in degrees between a peg's bearing and the nearest end of the swing line (0 to 90). */
export function distanceToSwingLine(pegBearing, swingBearing) {
  const d = ((pegBearing - swingBearing) % 180 + 180) % 180;
  return Math.min(d, 180 - d);
}

/** Normalise a bearing to [0, 360). */
export function norm360(deg) {
  return ((deg % 360) + 360) % 360;
}
