import * as A from '../vendor/astronomy.mjs';

export const zone = 'America/Chicago';
export const manor = new A.Observer(30.3408, -97.5569, 0);
const calendar = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit' });
const wall = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour:'2-digit', minute:'2-digit', hourCycle:'h23' });
export function localDay(time) {
  const parts = Object.fromEntries(calendar.formatToParts(time).map(p => [p.type, p.value]));
  return [parts.year, parts.month, parts.day].join('-');
}
function validDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(day + 'T12:00:00Z');
  return Number.isFinite(+date) && date.toISOString().startsWith(day);
}
function midnight(day) {
  // Both possible Manor offsets are whole hours. Test the candidates in the named zone.
  const utc = Date.parse(day + 'T00:00:00Z');
  return new Date([5, 6].map(h => utc + h * 3600000).find(t => wall.format(t) === '00:00'));
}
let cached;
export function events(day) {
  if (cached?.day === day) return cached;
  if (!validDay(day)) throw new RangeError('Invalid Manor calendar date');
  const start = midnight(day);
  const end = midnight(localDay(+start + 36 * 3600000));
  const riseSet = direction => {
    const t = A.SearchRiseSet('Sun', manor, direction, start, 2)?.date;
    return t && t < end ? t : null;
  };
  cached = {day, start, end, sunrise:riseSet(1), sunset:riseSet(-1),
    noon:A.SearchHourAngle('Sun', manor, 0, start).time.date};
  return cached;
}
export const sunriseFor = day => events(day).sunrise;
export const sunsetFor = day => events(day).sunset;
export const solarNoonFor = day => events(day).noon;
export function isManorLit(time, day = events(localDay(time))) {
  return time >= day.sunrise && time < day.sunset;
}
export function sunAt(time) {
  const eq = A.Equator('Sun', time, manor, true, true);
  const {altitude, azimuth} = A.Horizon(time, manor, eq.ra, eq.dec);
  const apparentAltitude = A.Horizon(time, manor, eq.ra, eq.dec, 'normal').altitude;
  return {altitude, apparentAltitude, azimuth};
}
export function skyPhase(time, position = sunAt(time), day = events(localDay(time))) {
  if (isManorLit(time, day)) return 'day';
  if (position.altitude < -18) return 'night';
  if (position.altitude < -6) return time < day.noon ? 'early-dawn' : 'late-dusk';
  return time < day.noon ? 'dawn' : 'dusk';
}
export function subsolarPoint(time) {
  const vector = A.RotateVector(A.Rotation_EQJ_EQD(time), A.GeoVector('Sun', time, true));
  const eq = A.EquatorFromVector(vector);
  return {lat:eq.dec, lon:((15 * (eq.ra - A.SiderealTime(time)) + 540) % 360) - 180};
}
export function session(params, today = new Date()) {
  const requested = params.get('date');
  const day = events(validDay(requested) ? requested : localDay(today));
  const time = params.get('time');
  let startTime = +day.sunrise - 45 * 60000;
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    const utc = Date.parse(day.day + 'T' + time + ':00Z');
    // Choose the first occurrence of a repeated time. A skipped time uses the default.
    startTime = [5,6].map(h => utc + h * 3600000).find(t => wall.format(t) === time) ?? startTime;
  }
  return {day, startTime};
}
