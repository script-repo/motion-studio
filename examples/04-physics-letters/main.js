// 04 — PixiJS renderer for the precomputed Rapier simulation. renderFrame(t) is stateless (reads frame t from SIM).
import { Application, Container, Graphics } from 'pixi.js';
import { GLYPHS } from './letters.js';
import { loadFonts } from '../lib/palette.js';
(async () => {
const SIM = window.SIM, PX = SIM.px;
const app = new Application();
await app.init({ width: innerWidth, height: innerHeight, background: '#F4EFE6', antialias: true, preserveDrawingBuffer: true, autoStart: false, resolution: 1 });
document.body.prepend(app.canvas); app.ticker.stop();
// floor line + grid dots
const bg = new Graphics();
for (let x = 48; x < innerWidth; x += 48) for (let y = 48; y < SIM.floor; y += 48) bg.circle(x, y, 1.4).fill({ color: '#0B1020', alpha: 0.10 });
bg.rect(0, SIM.floor, innerWidth, innerHeight - SIM.floor).fill('#0B1020');
app.stage.addChild(bg);
const shadows = new Container(), front = new Container(); app.stage.addChild(shadows, front);
const items = SIM.bodies.map(b => {
  const mk = (color, alpha) => { const c = new Container(); for (const [x, y, w, h, a] of GLYPHS[b.ch].rects) { const g = new Graphics(); const s = b.scale * PX; g.roundRect(-w * s / 2, -h * s / 2, w * s, h * s, Math.min(w, h) * s * 0.18).fill({ color, alpha }); g.position.set(x * s, y * s); g.rotation = a; c.addChild(g); } return c; };
  const sh = mk('#0B1020', 0.16), fr = mk(b.color, 1);
  (b.big ? shadows : shadows).addChild(sh); front.addChild(fr); return { b, sh, fr };
});
// big letters drawn last so they read on top
items.filter(i => i.b.big).forEach(i => front.addChild(i.fr));
await loadFonts(['500 20px "JetBrains Mono"']);
window.renderFrame = (t) => {
  const f = Math.min(SIM.bodies[0].frames.length - 1, Math.round(t * SIM.fps));
  for (const { b, sh, fr } of items) {
    const p = b.frames[f]; fr.visible = sh.visible = !!p; if (!p) continue;
    fr.position.set(p[0], p[1]); fr.rotation = p[2]; sh.position.set(p[0] + 7, p[1] + 10); sh.rotation = p[2];
  }
  app.renderer.render(app.stage);
};
window.__ready = true;
})();
