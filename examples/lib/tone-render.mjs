// Offline-render a Tone.js song to WAV in headless Chromium.
// Usage: node tone-render.mjs --song=song.js(bundled IIFE that sets window.renderSong(Tone)->Promise<ToneAudioBuffer>) --out=out.wav
import { launch } from './browser.mjs';
import fs from 'fs'; import path from 'path';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=')]; }));
const browser = await launch();
const page = await browser.newPage();
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto('file://' + path.resolve(path.dirname(new URL(import.meta.url).pathname), 'blank.html'));
await page.addScriptTag({ path: path.resolve(args.song) });
const b64 = await page.evaluate(async () => {
  const buf = await window.renderSong();
  const chans = []; for (let c = 0; c < buf.numberOfChannels; c++) chans.push(buf.getChannelData(c));
  const sr = buf.sampleRate, n = buf.length, nc = chans.length;
  const ab = new ArrayBuffer(44 + n * nc * 2); const dv = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); dv.setUint32(4, 36 + n * nc * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, nc, true); dv.setUint32(24, sr, true);
  dv.setUint32(28, sr * nc * 2, true); dv.setUint16(32, nc * 2, true); dv.setUint16(34, 16, true); ws(36, 'data'); dv.setUint32(40, n * nc * 2, true);
  let peak = 0; for (const ch of chans) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(ch[i]));
  const g = peak > 0 ? 0.89 / peak : 1; let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) { const s = Math.max(-1, Math.min(1, chans[c][i] * g)); dv.setInt16(o, s * 32767, true); o += 2; }
  let bin = ''; const u8 = new Uint8Array(ab); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(bin);
});
fs.writeFileSync(args.out, Buffer.from(b64, 'base64'));
await browser.close();
console.log('wrote', args.out);
