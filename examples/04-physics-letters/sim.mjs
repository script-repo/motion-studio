// 04 — Rapier 2D simulation, run offline in Node (deterministic). Writes per-frame transforms + impact events.
import RAPIER from '@dimforge/rapier2d-compat';
import fs from 'fs';
import { GLYPHS } from './letters.js';
await RAPIER.init();
const FPS = 30, DUR = 11, SUB = 4, PX = 118, W = 1920 / PX, H = 1080 / PX, FLOOR = H - 1.2;
const world = new RAPIER.World({ x: 0, y: 26 });
world.integrationParameters.dt = 1 / (FPS * SUB);
const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
world.createCollider(RAPIER.ColliderDesc.cuboid(W, 0.5).setTranslation(W / 2, FLOOR + 0.5).setFriction(0.9), ground);
world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, H * 3).setTranslation(-0.5, H / 2), ground);
world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, H * 3).setTranslation(W + 0.5, H / 2), ground);
let s = 99; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const PAL = ['#FF6B5B', '#FFC857', '#2EC4B6', '#7B61FF', '#6EC1FF', '#0B1020'];
const bodies = [];
function spawn(ch, x, y, scale, rot, t, color, big) {
  bodies.push({ ch, x, y, scale, rot, t, color, big, body: null, frames: [] });
}
// the word, dropped left to right
const word = 'MOTION', gap = 0.38; let total = 0; for (const c of word) total += GLYPHS[c].w; total += gap * (word.length - 1);
let cx = (W - total) / 2;
word.split('').forEach((c, i) => { const g = GLYPHS[c]; spawn(c, cx + g.w / 2, -2 - i * 0.2, 1, 0, 0.25 + i * 0.32, PAL[i % 5], true); cx += g.w + gap; });
// confetti letters
for (let i = 0; i < 34; i++) { const c = 'MOTION'[Math.floor(rnd() * 6)]; spawn(c, 1 + rnd() * (W - 2), -1.5 - rnd() * 2, 0.24 + rnd() * 0.12, rnd() * 6.28, 3.6 + i * 0.075, PAL[Math.floor(rnd() * 6)], false); }
const events = [];
const eq = new RAPIER.EventQueue(true);
const handleToBody = new Map();
const N = FPS * DUR;
for (let f = 0; f < N; f++) {
  const t = f / FPS;
  for (const b of bodies) if (!b.body && t >= b.t) {
    b.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(b.x, b.y).setRotation(b.rot).setLinvel(0, 6).setAngvel((rnd() - 0.5) * (b.big ? 0.0 : 5)));
    for (const [rx, ry, w, h, a] of GLYPHS[b.ch].rects) {
      const cd = RAPIER.ColliderDesc.cuboid(w * b.scale / 2, h * b.scale / 2).setTranslation(rx * b.scale, ry * b.scale).setRotation(a)
        .setDensity(b.big ? 3 : 1).setFriction(b.big ? 1.0 : 0.6).setRestitution(b.big ? 0.06 : 0.3).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
      handleToBody.set(world.createCollider(cd, b.body).handle, b);
    }
  }
  for (let k = 0; k < SUB; k++) {
    world.step(eq);
    eq.drainCollisionEvents((h1, h2, started) => {
      if (!started) return; const a = handleToBody.get(h1), c = handleToBody.get(h2);
      const va = a ? a.body.linvel() : { x: 0, y: 0 }, vc = c ? c.body.linvel() : { x: 0, y: 0 };
      const v = Math.hypot(va.x - vc.x, va.y - vc.y); const who = a || c;
      if (v > 3) events.push({ t: t + k / (FPS * SUB), v: +v.toFixed(2), big: !!((a && a.big) || (c && c.big)), x: +(who.body.translation().x / W).toFixed(3) });
    });
  }
  for (const b of bodies) { if (b.body) { const p = b.body.translation(); b.frames.push([+(p.x * PX).toFixed(2), +(p.y * PX).toFixed(2), +b.body.rotation().toFixed(4)]); } else b.frames.push(null); }
}
// thin events: merge hits within 40 ms, keep loudest
events.sort((a, b) => a.t - b.t); const ev = [];
for (const e of events) { const l = ev[ev.length - 1]; if (l && e.t - l.t < 0.04) { if (e.v > l.v) Object.assign(l, e); } else ev.push(e); }
const out = { fps: FPS, px: PX, floor: FLOOR * PX, bodies: bodies.map(b => ({ ch: b.ch, scale: b.scale, color: b.color, big: b.big, frames: b.frames })), events: ev };
fs.writeFileSync('sim.json', JSON.stringify(out)); fs.writeFileSync('sim-data.js', 'window.SIM=' + JSON.stringify(out) + ';');
console.log('bodies', bodies.length, 'impact events', ev.length);
