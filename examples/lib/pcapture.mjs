// Parallel deterministic capture for stateless pieces (window.renderFrame(t) must be a pure function of t).
// Usage: node pcapture.mjs --html= --out= --w= --h= --fps=30 --dur=10 [--workers=6] [--audio=] [--crf=20] [--query=] [--stills=t:file,...]
import { launch } from './browser.mjs';
import { spawnSync } from 'child_process';
import fs from 'fs'; import path from 'path'; import os from 'os';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const W = +(args.w || 1080), H = +(args.h || 1080), FPS = +(args.fps || 30), DUR = +(args.dur || 10), K = +(args.workers || 6);
const N = Math.round(FPS * DUR), t0 = Date.now();
const dir = fs.mkdtempSync(path.join(process.env.FRAMES_DIR || os.tmpdir(), 'motion-frames-'));
let done = 0;
async function worker(w) {
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  await page.goto('file://' + path.resolve(args.html) + (args.query || ''));
  for (let k = 0; k < 600 && !(await page.evaluate(() => !!window.__ready)); k++) await new Promise(r => setTimeout(r, 100));
  for (let i = w; i < N; i += K) {
    await page.evaluate(async ([t, i]) => { await window.renderFrame(t, i); }, [i / FPS, i]);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(5, '0')}.png`), type: 'png' });
    if (++done % 60 === 0) console.log(`frames ${done}/${N} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  await browser.close();
}
await Promise.all([...Array(K).keys()].map(worker));
for (const s of (args.stills ? String(args.stills).split(',') : [])) { const [t, f] = s.split(':'); fs.copyFileSync(path.join(dir, `f${String(Math.round(+t * FPS)).padStart(5, '0')}.png`), f); }
const ff = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.png')];
if (args.audio) ff.push('-i', args.audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
ff.push('-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 20), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', args.out);
const r = spawnSync('ffmpeg', ff, { stdio: 'inherit' });
fs.rmSync(dir, { recursive: true, force: true });
console.log(`DONE ${args.out} (${N} frames, ${K} workers) in ${((Date.now() - t0) / 1000).toFixed(1)}s exit=${r.status}`);
