// 02 — Flow-field poster. p5.js draws a perfectly looping noise flow field (noise space traversed on a closed loop),
// Playwright steps frames deterministically and FFmpeg encodes. Same sketch renders a 2880x3600 PNG poster.
import p5 from 'p5';
import { loadFonts } from '../lib/palette.js';
const q = new URLSearchParams(location.search);
const S = +(q.get('scale') || 1);           // output scale (1 => 1080x1350)
const BW = 1080, BH = 1350, LOOP = 10;      // base size, loop seconds
const STOPS = ['#2EC4B6', '#6EC1FF', '#7B61FF', '#C86BFA', '#FF6B5B', '#FFC857'];
let P, seeds = [];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function grad(u) { u = Math.min(0.9999, Math.max(0, u)) * (STOPS.length - 1); const i = Math.floor(u), f = u - i; const a = hex(STOPS[i]), b = hex(STOPS[i + 1]); return a.map((v, k) => v + (b[k] - v) * f); }
function rand(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
new p5(p => {
  P = p;
  p.setup = async () => {
    p.createCanvas(BW * S, BH * S); p.pixelDensity(1); p.noLoop(); p.noiseSeed(7); p.noiseDetail(3, 0.45);
    const r = rand(42);
    for (let i = 0; i < 3000; i++) seeds.push({ x: r() * 1.2 - 0.1, y: r() * 1.35 - 0.05, o: r(), w: 0.4 + r() * 1.4, l: 50 + Math.floor(r() * 60) });
    await loadFonts(['700 40px "Space Grotesk"', '500 20px "Space Grotesk"', '400 20px "JetBrains Mono"']);
    window.__ready = true; window.renderFrame(0);
  };
});
function field(x, y, th) {
  const R = 0.55; // closed loop through noise space => seamless loop
  return P.noise(x * 2.1 + R * Math.cos(th), y * 2.1 + R * Math.sin(th), 3.0 + 0.35 * Math.sin(th)) * Math.PI * 4.2;
}
window.renderFrame = (t) => {
  const p = P; if (!p) return;
  const th = (t / LOOP) * Math.PI * 2;
  p.push(); p.scale(S);
  const ctx = p.drawingContext;
  // background: deep ink with soft vignette
  const g = ctx.createRadialGradient(BW * 0.5, BH * 0.42, 50, BW * 0.5, BH * 0.5, BH * 0.8);
  g.addColorStop(0, '#18204A'); g.addColorStop(1, '#070A16'); ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
  ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  const step = 4.2, heads = [];
  for (const s of seeds) {
    let x = s.x, y = s.y; const pts = [[x, y]];
    for (let k = 0; k < s.l; k++) { const a = field(x, y, th); x += Math.cos(a) * step / BW; y += Math.sin(a) * step / BW; pts.push([x, y]); }
    const c = grad((s.y * 0.62 + s.x * 0.3) + 0.12 * Math.sin(th + s.o * 6.283));
    // tapered trail, drawn in 8-point chunks with alpha following a sine envelope
    for (let k0 = 0; k0 < pts.length - 1; k0 += 8) {
      const k1 = Math.min(pts.length - 1, k0 + 8); const u = (k0 + k1) / 2 / pts.length; const a = 0.16 * Math.sin(Math.PI * u);
      ctx.strokeStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(pts[k0][0] * BW, pts[k0][1] * BW); for (let k = k0 + 1; k <= k1; k++) ctx.lineTo(pts[k][0] * BW, pts[k][1] * BW); ctx.stroke();
    }
    // comet head travelling along the streamline (phase loops with the field)
    const ph = ((t / LOOP) * 3 + s.o) % 1; const hk = Math.floor(ph * (pts.length - 1));
    heads.push([pts[hk][0] * BW, pts[hk][1] * BW, c, Math.sin(Math.PI * ph)]);
  }
  for (const [x, y, c, a] of heads) { ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${0.55 * a})`; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  // typographic frame
  const fade = ctx.createLinearGradient(0, BH - 330, 0, BH); fade.addColorStop(0, 'rgba(7,10,22,0)'); fade.addColorStop(1, 'rgba(7,10,22,0.92)');
  ctx.fillStyle = fade; ctx.fillRect(0, BH - 330, BW, 330);
  ctx.fillStyle = '#F4EFE6'; ctx.textBaseline = 'alphabetic';
  ctx.font = '700 132px "Space Grotesk"'; ctx.fillText('Flow', 72, BH - 150); ctx.fillStyle = '#FFC857'; ctx.fillText('Field', 72 + ctx.measureText('Flow ').width, BH - 150);
  ctx.fillStyle = 'rgba(244,239,230,0.72)'; ctx.font = '400 19px "JetBrains Mono"';
  ctx.fillText('GENERATIVE STUDY Nº 02  ·  3,000 STREAMLINES  ·  SEAMLESS 10 s LOOP', 76, BH - 92);
  ctx.fillText('MOTION STUDIO', 76, 92); ctx.textAlign = 'right'; ctx.fillText('p5.js  ·  noise field', BW - 76, 92); ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(244,239,230,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(76, 112); ctx.lineTo(BW - 76, 112); ctx.stroke();
  p.pop();
};
window.saveCanvas = () => document.querySelector('canvas').toDataURL('image/png');
