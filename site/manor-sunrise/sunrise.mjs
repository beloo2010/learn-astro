import {session, zone, sunAt, isManorLit, skyPhase, subsolarPoint} from './model.mjs';
import {globeView, backyard} from './views.mjs';
const id=name=>document.getElementById(name);
const {day,startTime}=session(new URLSearchParams(location.search));
const clock=new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit',timeZoneName:'short'});
const shortClock=new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit'});
const drawGlobe=globeView(id('globe'));
const slider=id('time'), play=id('play');
const duration=(day.end-day.start)/60000;
slider.max=duration;
id('date').textContent=new Intl.DateTimeFormat('en-US',{timeZone:zone,dateStyle:'full'}).format(day.start);
id('rise').textContent='Sunrise today: '+shortClock.format(day.sunrise);
let moment=startTime, frame=0, lastFrame, sunriseUntil=0;
function draw(next,exact=false) {
  if((moment<day.sunrise && next>=day.sunrise && next-day.sunrise<120000)||exact) sunriseUntil=performance.now()+2500;
  moment=next;
  const time=new Date(moment), position=sunAt(time), lit=isManorLit(time,day);
  drawGlobe(subsolarPoint(time),lit);
  backyard(id('sky'),position,lit,time<day.noon);
  const phase=skyPhase(time,position,day).replace('-',' ');
  id('phase').textContent=lit && performance.now()<sunriseUntil?'Day · Sunrise!':phase[0].toUpperCase()+phase.slice(1);
  id('clock').textContent=clock.format(time);
  slider.value=Math.round((time-day.start)/60000);
  slider.setAttribute('aria-valuetext',clock.format(time));
  const minutes=Math.round(Math.abs(time-day.sunrise)/60000);
  id('count').textContent=time>day.noon?'':(time<day.sunrise?'Sunrise in '+minutes+' min':'The Sun rose '+minutes+' min ago');
}
function stop() {cancelAnimationFrame(frame);frame=0;lastFrame=undefined;play.textContent='Play';}
function update(now) {
  const next=Math.min(+day.end,moment+(now-(lastFrame??now))*900);
  lastFrame=now;draw(next);
  if(next>=day.end) stop(); else frame=requestAnimationFrame(update);
}
play.onclick=()=>{if(frame){stop();return;}if(moment>=day.end)draw(+day.start);play.textContent='Pause';frame=requestAnimationFrame(update);};
slider.onpointerdown=stop;
slider.oninput=()=>{stop();draw(+day.start+Number(slider.value)*60000);};
slider.onkeydown=e=>{
  if(!['PageUp','PageDown'].includes(e.key)) return;
  e.preventDefault();stop();
  draw(Math.max(+day.start,Math.min(+day.end,moment+(e.key==='PageUp'?15:-15)*60000)));
};
for(const [name,time] of [['Midnight',day.start],['Sunrise',day.sunrise],['Noon',day.noon],['Sunset',day.sunset]]) {
  const button=document.createElement('button');
  button.style.left=((time-day.start)/(day.end-day.start)*100)+'%';
  button.append(name,document.createElement('br'),shortClock.format(time));
  button.onclick=()=>{stop();draw(+time,name==='Sunrise');};
  id('ticks').append(button);
}
draw(moment);
