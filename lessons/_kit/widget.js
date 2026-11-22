// Small helpers shared by lesson interactives. Plain ES module, no build step.

/** Keep a canvas sharp and sized to its container. `draw(ctx, w, h)` is called after each resize. */
export function fitCanvas(canvas, aspect, maxHeight, draw) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  function resize() {
    const width = canvas.parentElement.clientWidth - 12;
    w = Math.max(200, width);
    h = Math.min(maxHeight, Math.round(w * aspect));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, w, h);
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  return { ctx, size: () => ({ w, h }), redraw: () => draw(ctx, w, h) };
}

/** Wire a range input to an <output>, calling `onInput(value)` on every change. */
export function slider(id, format, onInput) {
  const input = document.getElementById(id);
  const out = document.querySelector(`output[for="${id}"]`);
  const update = () => { const v = Number(input.value); if (out) out.textContent = format(v); onInput(v); };
  input.addEventListener('input', update);
  update();
  return {
    input,
    set(v) { input.value = v; update(); },
    get value() { return Number(input.value); },
  };
}

/** Wire a checkbox. */
export function toggle(id, onChange) {
  const box = document.getElementById(id);
  box.addEventListener('change', () => onChange(box.checked));
  onChange(box.checked);
  return box;
}

/** requestAnimationFrame loop with a play/pause button. `step(dtSeconds)` runs while playing. */
export function player(buttonId, step, startPlaying = false) {
  const button = document.getElementById(buttonId);
  let playing = false, last = 0;
  function frame(t) {
    if (!playing) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    step(dt);
    requestAnimationFrame(frame);
  }
  function set(on) {
    playing = on; last = 0;
    button.textContent = on ? 'Pause' : 'Play';
    button.setAttribute('aria-pressed', String(on));
    if (on) requestAnimationFrame(frame);
  }
  button.addEventListener('click', () => set(!playing));
  // Respect reduced-motion: never autoplay.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  set(startPlaying && !reduce);
  return { set, get playing() { return playing; } };
}

export const DEG = Math.PI / 180;
export const SIDEREAL_DAY_H = 23.934; // one turn of Earth against the stars, in hours (OpenStax 4.3)
export const EQUATOR_KM = 40075;      // Earth's circumference at the equator
export const KM_PER_MILE = 1.609;

export function fmt(n, digits = 0) {
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

/** Format decimal hours as "6:30 a.m." style clock text. */
export function clock(hours) {
  const total = Math.round(((hours % 24) + 24) % 24 * 60) % (24 * 60);
  const h = Math.floor(total / 60), m = total % 60;
  const ampm = h < 12 ? 'a.m.' : 'p.m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Draw a filled circle. */
export function dot(ctx, x, y, r, color) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill();
}

/** Draw text with a dark halo so it stays readable over any background. */
export function label(ctx, text, x, y, color = '#fff', align = 'left', size = 13) {
  ctx.font = `${size}px system-ui, sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.strokeText(text, x, y);
  ctx.fillStyle = color; ctx.fillText(text, x, y);
}

// Tell a parent page (the course site) how tall this interactive is, so it can size the frame.
// Message shape: { type: 'lesson-widget-height', height: <px> }. Harmless when opened on its own.
if (window.parent !== window) {
  const send = () => window.parent.postMessage({ type: 'lesson-widget-height', height: Math.ceil(document.body.getBoundingClientRect().height) }, '*');
  new ResizeObserver(send).observe(document.body);
  window.addEventListener('load', send);
}
