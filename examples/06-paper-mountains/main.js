// 06 — Self-drawing line art. Paper.js builds the vector scene; an Anime.js timeline (seeked, not played) drives
// every stroke's draw-on progress with staggered easing. Final frame is exported as SVG.
import paper from 'paper/dist/paper-core';
import { createTimeline } from 'animejs';
import { loadFonts } from '../lib/palette.js';
const INK = '#1B2238', CORAL = '#FF6B5B', AMBER = '#FFC857', CREAM = '#F4EFE6', TEAL = '#2EC4B6';
paper.setup(document.getElementById('c'));
const { Path, Point, Group, PointText, Color } = paper;
let seed = 11; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const strokes = []; // {path, len, p (0..1), key}
function draw(path, key) { path.strokeCap = 'round'; path.strokeJoin = 'round'; const s = { path, len: path.length, p: 0, key }; strokes.push(s); return s; }
const S = 1080;
// --- sun ---
const sunC = new Point(700, 360);
const sunFill = new Path.Circle(sunC, 150); sunFill.fillColor = new Color(AMBER); sunFill.opacity = 0;
const sun = draw(new Path.Circle(sunC, 150), 'sun'); sun.path.strokeColor = CORAL; sun.path.strokeWidth = 4; sun.path.rotate(-90, sunC);
const halos = [175, 205].map((r, i) => { const s = draw(new Path.Circle(sunC, r), 'halo' + i); s.path.strokeColor = CORAL; s.path.strokeWidth = 1.5; s.path.opacity = 0.55 - i * 0.2; s.path.dashArray = null; return s; });
const rays = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; const r0 = 230, r1 = 230 + (i % 2 ? 40 : 70);
  const s = draw(new Path.Line(sunC.add(new Point(Math.cos(a) * r0, Math.sin(a) * r0)), sunC.add(new Point(Math.cos(a) * r1, Math.sin(a) * r1))), 'ray'); s.path.strokeColor = CORAL; s.path.strokeWidth = 2; rays.push(s); }
// --- mountain ridges (fractal midpoint displacement), back to front ---
function ridge(base, amp, rough, peaks) {
  let pts = [new Point(-40, base - rnd() * amp * 0.3), new Point(S + 40, base - rnd() * amp * 0.3)];
  let d = amp; for (let k = 0; k < 6; k++) { const n = []; for (let i = 0; i < pts.length - 1; i++) { n.push(pts[i]); const m = pts[i].add(pts[i + 1]).divide(2); n.push(new Point(m.x, m.y - (rnd() - 0.35) * d)); } n.push(pts[pts.length - 1]); pts = n; d *= rough; }
  for (const [px, ph] of peaks) pts = pts.map(p => new Point(p.x, p.y - ph * Math.exp(-Math.pow((p.x - px) / 150, 2))));
  return pts;
}
const layers = [
  { base: 640, amp: 120, rough: 0.55, peaks: [[220, 140], [860, 90]], fill: '#D9D3EA', w: 2 },
  { base: 700, amp: 140, rough: 0.52, peaks: [[470, 230]], fill: '#B9C4E4', w: 2.5 },
  { base: 770, amp: 110, rough: 0.5, peaks: [[120, 120], [760, 160]], fill: '#8FA6D6', w: 3 },
  { base: 880, amp: 120, rough: 0.5, peaks: [[960, 150], [330, 70]], fill: '#4C5E9A', w: 3.5 },
];
const ridgeStrokes = [], fills = [], hatch = [];
layers.forEach((L, li) => {
  const pts = ridge(L.base, L.amp, L.rough, L.peaks);
  const f = new Path(pts); f.add(new Point(S + 40, S + 40), new Point(-40, S + 40)); f.closed = true; f.fillColor = new Color(L.fill); f.opacity = 0; fills.push(f);
  const r = draw(new Path(pts), 'ridge' + li); r.path.smooth({ type: 'catmull-rom', factor: 0.5 }); r.path.strokeColor = INK; r.path.strokeWidth = L.w; ridgeStrokes.push(r);
  f.smooth({ type: 'catmull-rom', factor: 0.5 });
  // engraving: offset copies below the ridge
  for (let k = 1; k <= 3; k++) { const h = draw(new Path(pts.map(p => p.add(new Point(0, k * 14 + li * 2)))), 'hatch'); h.path.smooth({ type: 'catmull-rom', factor: 0.5 }); h.path.strokeColor = INK; h.path.strokeWidth = 1; h.path.opacity = 0.45 - k * 0.1; h.li = li; hatch.push(h); }
});
// --- lake lines ---
const water = []; for (let i = 0; i < 9; i++) { const y = 930 + i * 16; let x = 60 + rnd() * 160 + i * 10; const x1 = S - 60 - rnd() * 160 - i * 10;
  while (x < x1) { const w = Math.min(x1 - x, 30 + rnd() * 90); const s = draw(new Path.Line(new Point(x, y), new Point(x + w, y)), 'water'); s.path.strokeColor = (i + Math.floor(x / 200)) % 4 === 0 ? CORAL : INK; s.path.strokeWidth = 1.6; s.path.opacity = 0.75; water.push(s); x += w + 12 + rnd() * 16; } }
const lake = new Path.Rectangle(new Point(-10, 905), new Point(S + 10, S + 10)); lake.fillColor = new Color('#F4EFE6'); lake.opacity = 0;
const shore = draw(new Path.Line(new Point(-10, 905), new Point(S + 10, 905)), 'shore'); shore.path.strokeColor = INK; shore.path.strokeWidth = 3.5;
// --- birds ---
const birds = [[300, 250, 1], [345, 230, 0.8], [380, 268, 0.65]].map(([x, y, s]) => { const p = new Path([new Point(x - 22 * s, y - 8 * s), new Point(x, y + 4 * s), new Point(x + 22 * s, y - 8 * s)]); p.smooth(); const d = draw(p, 'bird'); d.path.strokeColor = INK; d.path.strokeWidth = 2.2; return d; });
// --- type ---
const title = new PointText({ point: [64, 120], content: 'Alpenglow', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 76, fillColor: INK, opacity: 0 });
const sub = new PointText({ point: [68, 162], content: 'LINE STUDY Nº 06  ·  PAPER.JS + ANIME.JS', fontFamily: 'JetBrains Mono', fontSize: 17, fillColor: INK, opacity: 0, letterSpacing: 2 });
// sun fill behind its stroke, fills behind ridges in order
sunFill.sendToBack();
fills.forEach((f, i) => f.insertBelow(ridgeStrokes[i].path));
fills.forEach((f, i) => { hatch.filter(h => h.li === i).forEach(h => h.path.insertAbove(f)); });
lake.bringToFront(); shore.path.bringToFront(); water.forEach(w => w.path.bringToFront()); birds.forEach(b => b.path.bringToFront());
// --- Anime.js timeline (paused; seeked per frame) ---
const fade = { sun: 0, f0: 0, f1: 0, f2: 0, f3: 0, type: 0 };
const tl = createTimeline({ autoplay: false });
tl.add(sun, { p: 1, duration: 1800, ease: 'inOutCubic' }, 0)
  .add(halos, { p: 1, duration: 1400, ease: 'outCubic', delay: (_, i) => i * 250 }, 600)
  .add(rays, { p: 1, duration: 500, ease: 'outQuad', delay: (_, i) => i * 45 }, 1300)
  .add(ridgeStrokes, { p: 1, duration: 2200, ease: 'inOutSine', delay: (_, i) => i * 650 }, 1600)
  .add(hatch, { p: 1, duration: 1500, ease: 'outSine', delay: (_, i) => i * 90 }, 3600)
  .add(fade, { f0: 1, f1: 1, f2: 1, f3: 1, duration: 1400, ease: 'outQuad', delay: 0 }, 5600)
  .add(fade, { sun: 0.9, duration: 1400, ease: 'outQuad' }, 5200)
  .add(shore, { p: 1, duration: 1200, ease: 'inOutCubic' }, 5400)
  .add(water, { p: 1, duration: 900, ease: 'outCubic', delay: (_, i) => i * 18 }, 6200)
  .add(birds, { p: 1, duration: 700, ease: 'outBack', delay: (_, i) => i * 160 }, 7300)
  .add(fade, { type: 1, duration: 900, ease: 'outCubic' }, 7900);
function apply() {
  for (const s of strokes) { const vis = Math.max(0, Math.min(1, s.p)); s.path.dashArray = [s.len * vis, s.len * 1.01 + 1]; s.path.visible = vis > 0.001; }
  sunFill.opacity = fade.sun; fills.forEach((f, i) => f.opacity = fade['f' + i]); lake.opacity = fade.f3; title.opacity = sub.opacity = fade.type; title.position.y = 95 + 12 * (1 - fade.type);
  paper.view.update();
}
window.renderFrame = (t) => { tl.seek(Math.min(t * 1000, tl.duration)); apply(); };
window.exportSVG = () => { tl.seek(tl.duration); apply(); return paper.project.exportSVG({ asString: true }); };
loadFonts(['700 76px "Space Grotesk"', '400 17px "JetBrains Mono"']).then(() => { title.fontFamily = 'Space Grotesk'; renderFrame(0); window.__ready = true; });
