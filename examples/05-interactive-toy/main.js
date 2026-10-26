// 05 — "Constellation": interactive toy. tsParticles draws the reactive particle field (grab/bubble on hover, push on click);
// Anime.js drives the intro, the magnetic title letters, the spring cursor ring and click ripples.
import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { animate, createTimeline, stagger, utils } from 'animejs';
const CAPTURE = new URLSearchParams(location.search).has('capture');
const PAL = ['#FF6B5B', '#FFC857', '#2EC4B6', '#7B61FF', '#6EC1FF', '#F4EFE6'];
const title = document.getElementById('title');
title.innerHTML = title.textContent.split('').map(c => c === ' ' ? '<span class="sp"> </span>' : `<span class="ch">${c}</span>`).join('');
const chars = [...title.querySelectorAll('.ch')];
(async () => {
  await loadFull(tsParticles);
  const container = await tsParticles.load({ id: 'tsp', options: {
    fpsLimit: 60, detectRetina: false, background: { color: 'transparent' },
    particles: { number: { value: 150, density: { enable: true } }, paint: { fill: { enable: true, color: { value: PAL } } }, shape: { type: 'circle' },
      opacity: { value: { min: 0.35, max: 0.9 } }, size: { value: { min: 2, max: 5.5 } },
      links: { enable: true, distance: 130, color: '#9AA3C7', opacity: 0.22, width: 1 },
      move: { enable: true, speed: 0.7, direction: 'none', outModes: { default: 'bounce' } } },
    interactivity: { detectsOn: 'window', events: { onHover: { enable: true, mode: ['grab', 'bubble'] }, onClick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 220, links: { opacity: 0.75, color: '#FFC857' } }, bubble: { distance: 160, size: 9, duration: 1.2, opacity: 1 }, push: { quantity: 6 } } },
  } });
  // intro: letters rise in with a springy stagger
  createTimeline().add(chars, { y: [{ from: 80 }, 0], opacity: [0, 1], rotate: [{ from: () => utils.random(-30, 30) }, 0], duration: 1100, ease: 'outElastic(1, .6)', delay: stagger(45) }, 200)
    .add('#sub', { opacity: [0, 1], y: [16, 0], duration: 700, ease: 'outCubic' }, 900)
    .add('#hint', { opacity: [0, 1], scale: [0.8, 1], duration: 600, ease: 'outBack' }, 1300);
  window.__ready = true;
})();
// cursor ring + magnetic letters
const ring = document.getElementById('ring'), dot = document.getElementById('cur');
let mx = -200, my = -200; utils.set(ring, { x: -200, y: -200 });
const centers = () => chars.map(c => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2 - (c._dx || 0), r.top + r.height / 2 - (c._dy || 0)]; });
let cc = null;
window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (CAPTURE) { dot.style.transform = `translate(${mx}px, ${my}px)`; }
  animate(ring, { x: mx, y: my, duration: 650, ease: 'outElastic(1, .7)' });
  if (!cc) cc = centers();
  chars.forEach((c, i) => { const [cx, cy] = cc[i]; const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy); const f = Math.max(0, 1 - d / 260);
    const tx = dx / (d || 1) * 46 * f, ty = dy / (d || 1) * 46 * f; c._dx = tx; c._dy = ty;
    animate(c, { x: tx, y: ty, scale: 1 + 0.35 * f, color: f > 0.25 ? PAL[i % 5] : '#F4EFE6', duration: 900, ease: 'outElastic(1, .55)' }); });
});
window.addEventListener('mousedown', () => {
  const r = document.createElement('div'); r.className = 'ripple'; document.body.appendChild(r);
  utils.set(r, { x: mx, y: my, borderColor: PAL[Math.floor(Math.random() * 5)] });
  animate(r, { scale: [0.1, 6], opacity: [0.9, 0], borderWidth: [6, 0.5], duration: 1100, ease: 'outExpo', onComplete: () => r.remove() });
  animate(ring, { scale: [{ to: 0.6, duration: 90 }, { to: 1, duration: 700, ease: 'outElastic(1, .4)' }] });
  animate(chars, { rotate: [{ to: () => utils.random(-14, 14), duration: 120 }, { to: 0, duration: 900, ease: 'outElastic(1, .5)' }], delay: stagger(18, { from: 'center' }) });
});
// scripted cursor path for the video capture (Lissajous wander, three clicks)
window.mouseAt = (t) => {
  const W = innerWidth, H = innerHeight; const k = Math.min(1, t / 1.6), e = 1 - Math.pow(1 - k, 3);
  const lx = W * (0.5 + 0.32 * Math.sin(t * 0.9 + 0.4)), ly = H * (0.5 + 0.26 * Math.sin(t * 1.55));
  const x = W * 1.05 + (lx - W * 1.05) * e, y = H * 0.95 + (ly - H * 0.95) * e;
  const down = [3.0, 5.3, 7.6].some(c => t >= c && t < c + 0.12);
  return { x, y, down };
};
