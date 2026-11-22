import {LAND} from './continents.mjs';
import {manor} from './model.mjs';

const rad = Math.PI / 180;
function label(ctx, text, x, y, align='left') {
  ctx.font='bold 15px system-ui'; ctx.textAlign=align; ctx.lineWidth=3;
  ctx.strokeStyle='#132632'; ctx.strokeText(text,x,y); ctx.fillStyle='white'; ctx.fillText(text,x,y);
}
function worldTexture() {
  const canvas=document.createElement('canvas'); canvas.width=360; canvas.height=180;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#377caa'; ctx.fillRect(0,0,360,180); ctx.fillStyle='#84ac78';
  for (const coast of LAND) {
    ctx.beginPath();
    coast.forEach(([lon,lat],i)=>i ? ctx.lineTo(lon+180,90-lat) : ctx.moveTo(lon+180,90-lat));
    ctx.fill();
  }
  return ctx.getImageData(0,0,360,180).data;
}
export function globeView(canvas) {
  const ctx=canvas.getContext('2d'), texture=worldTexture();
  const radius=99, size=radius*2, centerX=210, centerY=135;
  const image=ctx.createImageData(size,size), pixels=[];
  const cos=Math.cos(70*rad), sin=Math.sin(70*rad);
  // Orthographic camera at 70° N. Cache each visible pixel's surface normal and map row.
  for(let row=0;row<size;row++) for(let col=0;col<size;col++) {
    const east=(col+.5-radius)/radius, north=(radius-row-.5)/radius;
    const depth=Math.sqrt(1-east*east-north*north);
    if (!Number.isFinite(depth)) continue;
    const polar=north*cos+depth*sin;
    const lon=Math.atan2(east,depth*cos-north*sin)/rad;
    const texRow=Math.min(179,Math.floor(90-Math.asin(polar)/rad));
    pixels.push({offset:4*(row*size+col),east,polar,lon,texRow});
  }
  return (sun,lit)=>{
    const cameraLon=sun.lon-90, declination=sun.lat*rad;
    const sunEast=Math.cos(declination), sunNorth=Math.sin(declination);
    ctx.fillStyle='#101e31';ctx.fillRect(0,0,canvas.width,canvas.height);
    for(const p of pixels) {
      const light=p.east*sunEast+p.polar*sunNorth;
      const shade=.29+.71*Math.min(1,Math.max(0,light*18+.5));
      const x=Math.floor(((p.lon+cameraLon+180)%360+360)%360);
      const tex=4*(360*p.texRow+x);
      for(let i=0;i<3;i++) image.data[p.offset+i]=texture[tex+i]*shade;
      image.data[p.offset+3]=255;
    }
    ctx.putImageData(image,centerX-radius,centerY-radius);
    const angle=(manor.longitude-cameraLon)*rad, lat=manor.latitude*rad;
    const x=centerX+radius*Math.cos(lat)*Math.sin(angle);
    const y=centerY-radius*(cos*Math.sin(lat)-sin*Math.cos(lat)*Math.cos(angle));
    ctx.fillStyle=lit?'#ffda6d':'#91bfff';ctx.strokeStyle='#111';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(x,y,6,0,2*Math.PI);ctx.fill();ctx.stroke();
    label(ctx,'Manor (you are here)',x+(x>centerX?-9:9),y<60 ? y+23 : y-9,x>centerX?'right':'left');
    const sunX = 431, sunY = centerY;
    ctx.fillStyle = '#ffdf79';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 13, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffdf79';
    ctx.lineWidth = 2;
    for (const offset of [-9, 0, 9]) {
      const rayY = sunY + offset;
      ctx.beginPath();
      ctx.moveTo(sunX-20, rayY);
      ctx.lineTo(353, rayY);
      ctx.lineTo(359, rayY-3);
      ctx.moveTo(353, rayY);
      ctx.lineTo(359, rayY+3);
      ctx.stroke();
    }
    label(ctx,'Sunlight',sunX,sunY+39,'center');
    label(ctx,'↺ West to east',centerX,25,'center');
  };
}
function mix(a,b,t) {return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
const colors=[[-18,[12,22,47],[25,37,73]],[-6,[30,58,108],[148,107,122]],
  [0,[48,96,151],[255,182,118]],[12,[53,133,196],[188,222,240]]];
export function backyard(canvas,position,lit,beforeNoon) {
  const ctx=canvas.getContext('2d'), w=canvas.width, h=canvas.height, horizon=h-48;
  const {azimuth,apparentAltitude,altitude}=position;
  const height=Math.max(-18,Math.min(12,altitude));
  const idx=colors.findIndex(row=>row[0]>=height);
  const low=colors[Math.max(0,idx-1)], high=colors[idx];
  const t=(height-low[0])/(high[0]-low[0]||1);
  const gradient=ctx.createLinearGradient(0,0,0,horizon);
  for(const band of [1,2]) gradient.addColorStop(band-1,'rgb('+mix(low[band],high[band],t).join(',')+')');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
  if(altitude < -12) {
    ctx.fillStyle='white';
    for(let i=0;i<18;i++) ctx.fillRect((i*79+11)%w,(i*43+13)%155,1.6,1.6);
  }
  const x=(azimuth-45)/90*w, top=horizon-(apparentAltitude+.2667)*horizon/35;
  if(lit && x>=0 && x<=w && top>=-1) {
    ctx.save();
    ctx.shadowColor = '#fff5be';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(x,top+10,10,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  } else if(lit) label(ctx,beforeNoon?'↑ The Sun is up here':'The Sun is behind you, in the west',w/2,22,'center');
  ctx.fillStyle='#1e403a';ctx.fillRect(0,horizon,w,h-horizon);
  for(const [s,xp] of [['NE',16],['E',w/2],['SE',w-18]]) label(ctx,s,xp,horizon+25,'center');
}
