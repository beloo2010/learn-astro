import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as A from '../site/vendor/astronomy.mjs';
import {events,session,localDay,zone,manor,sunAt,skyPhase,isManorLit,subsolarPoint} from '../site/manor-sunrise/model.mjs';
const {dates}=JSON.parse(readFileSync(new URL('./data/manor-sunrise-usno.json',import.meta.url)));
assert.equal(dates.length,6);
const zoneName=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'short'});
for(const row of dates) {
  const day=events(row.date);
  for(const key of ['sunrise','sunset','noon']) {
    const [clock,abbr]=row[key].split(' ');
    const expected=Date.parse(row.date+'T'+clock+(abbr==='CST'?'-06:00':'-05:00'));
    assert.ok(Math.abs(day[key]-expected)<=120000,row.date+' '+key);
    assert.equal(zoneName.formatToParts(day[key]).find(p=>p.type==='timeZoneName').value,abbr);
  }
  for(const [time,lit] of [[day.sunrise-1000,false],[+day.sunrise,true],[day.sunset-1000,true],[+day.sunset,false]]) {
    assert.equal(isManorLit(new Date(time)),lit);
    assert.equal(skyPhase(new Date(time))==='day',lit);
  }
  const sun=sunAt(day.sunrise);
  assert.ok(Math.abs(sun.altitude+.8333)<.01);
  assert.ok(Math.abs(sun.apparentAltitude+.2667)<.1);
  assert.ok(Math.abs(sun.azimuth-row.azimuth)<1);
}
const march=events('2027-03-20');
for(const [alt,direction,before,after] of [[-18,1,'night','early-dawn'],[-6,1,'early-dawn','dawn'],[-6,-1,'dusk','late-dusk'],[-18,-1,'late-dusk','night']]) {
  const crossing=+A.SearchAltitude('Sun',manor,direction,march.start,1,alt).date;
  assert.equal(skyPhase(new Date(crossing-1000)),before);assert.equal(skyPhase(new Date(crossing+1000)),after);
}
const point=subsolarPoint(new Date('2027-03-20T13:38:00-05:00'));
assert.ok(Math.abs(point.lon+97.56)<.5 && Math.abs(point.lat)<.5);
const start=query=>session(new URLSearchParams(query),new Date('2027-01-16T02:00Z'));
assert.equal(start('date=2027-06-21&time=06:00').startTime,Date.parse('2027-06-21T11:00Z'));
assert.equal(start('date=nonsense').day.day,'2027-01-15');
assert.equal(start('date=2027-02-30').day.day,'2027-01-15');
for(const [day,hours] of [['2027-03-14',23],['2027-11-07',25]]) {
  const {start,end}=events(day);assert.equal((end-start)/3600000,hours);assert.equal(localDay(start),day);
}
assert.equal(start('date=2027-03-14&time=02:30').startTime,start('date=2027-03-14').startTime);
assert.equal(start('date=2027-11-07&time=01:30').startTime,Date.parse('2027-11-07T06:30Z'));
console.log('Manor Sunrise A1–A8, A5b and DST transition checks passed.');
