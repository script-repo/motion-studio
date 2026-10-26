// Deterministic frame-stepping capture: Playwright -> PNG frames -> FFmpeg (H.264 yuv420p +faststart)
// Usage: node capture.mjs --html=path --out=out.mp4 --w=1080 --h=1080 --fps=30 --dur=10 [--audio=a.wav] [--clock] [--crf=20] [--stills=2.5:a.png,9:b.png]
import { launch } from './browser.mjs';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const W = +(args.w || 1080), H = +(args.h || 1080), FPS = +(args.fps || 30), DUR = +(args.dur || 10);
const N = Math.round(FPS * DUR);
const t0 = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +(args.dpr || 1) });
page.on('console', m => { if (m.type() === 'error' || args.verbose) console.log('[page]', m.text()); });
page.on('pageerror', e => console.log('[pageerror]', e.message));
if (args.clock) await page.clock.install({ time: 0 });
const url = 'file://' + path.resolve(args.html) + (args.query || '');
await page.goto(url);
for (let k = 0; k < 600 && !(await page.evaluate(() => !!window.__ready)); k++) await new Promise(r => setTimeout(r, 100));
const stills = new Map((args.stills ? String(args.stills).split(',') : []).map(s => { const [t, f] = s.split(':'); return [Math.round(+t * FPS), f]; }));
const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-'];
if (args.audio) ffArgs.push('-i', args.audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push('-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 20), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', args.out);
const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
let prevMs = 0;
for (let i = 0; i < N; i++) {
  const t = i / FPS;
  if (args.clock) { const ms = Math.round(i * 1000 / FPS); if (ms > prevMs) await page.clock.runFor(ms - prevMs); prevMs = ms; }
  await page.evaluate(async ([t, i]) => { if (window.mouseAt) { /* handled outside */ } if (window.renderFrame) await window.renderFrame(t, i); }, [t, i]);
  if (args.mouse) { const p = await page.evaluate(t => window.mouseAt(t), t); if (p) { await page.mouse.move(p.x, p.y); if (p.down && !globalThis.__down) await page.mouse.down(); if (!p.down && globalThis.__down) await page.mouse.up(); globalThis.__down = !!p.down; } }
  const buf = await page.screenshot({ type: 'png', animations: 'allow', caret: 'initial' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (stills.has(i)) fs.writeFileSync(stills.get(i), buf);
  if (i % 60 === 0 || args.verbose) process.stdout.write(`frame ${i}/${N} ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`DONE ${args.out} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
