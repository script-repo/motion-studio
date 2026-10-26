// 08 — FFT analysis of the rendered WAV (radix-2 FFT, Hann window) -> per-frame log bands + bass/mid/high + kick onsets.
import fs from 'fs';
const FPS = 30, NB = 64, N = 2048;
const buf = fs.readFileSync('audio/signal-bloom.wav'); const sr = buf.readUInt32LE(24), nc = buf.readUInt16LE(22);
const ns = (buf.length - 44) / (2 * nc); const x = new Float32Array(ns);
for (let i = 0; i < ns; i++) { let s = 0; for (let c = 0; c < nc; c++) s += buf.readInt16LE(44 + (i * nc + c) * 2); x[i] = s / nc / 32768; }
function fft(re, im) { const n = re.length; for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = -2 * Math.PI / len; for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) { const c = Math.cos(a * k), s = Math.sin(a * k); const ur = re[i + k], ui = im[i + k]; const vr = re[i + k + len / 2] * c - im[i + k + len / 2] * s, vi = re[i + k + len / 2] * s + im[i + k + len / 2] * c; re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; } } }
const edges = [...Array(NB + 1).keys()].map(i => 40 * Math.pow(9000 / 40, i / NB));
const frames = Math.floor(ns / sr * FPS); const out = { fps: FPS, bands: [], bass: [], mid: [], high: [], kick: [], level: [] };
let prev = new Float32Array(NB), prevBass = 0, kickEnv = 0;
for (let f = 0; f < frames; f++) {
  const c = Math.floor(f / FPS * sr); const re = new Float32Array(N), im = new Float32Array(N); let rms = 0;
  for (let i = 0; i < N; i++) { const v = x[c - N / 2 + i] || 0; re[i] = v * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1))); rms += v * v; }
  fft(re, im); const mag = (k) => Math.hypot(re[k], im[k]);
  const bands = new Float32Array(NB); let raw = 0;
  for (let b = 0; b < NB; b++) { const k0 = Math.max(1, Math.floor(edges[b] / sr * N)), k1 = Math.max(k0 + 1, Math.ceil(edges[b + 1] / sr * N)); let s = 0; for (let k = k0; k < k1; k++) s = Math.max(s, mag(k));
    const db = 20 * Math.log10(s / (N / 4) + 1e-9); let v = Math.max(0, Math.min(1, (db + 58) / 52)) * (0.75 + 0.6 * b / NB);
    if (b < 6) raw += v / 6;
    v = v > prev[b] ? v : prev[b] * 0.82 + v * 0.18; bands[b] = Math.min(1, v); }
  prev = bands; const avg = (a, b) => bands.slice(a, b).reduce((s, v) => s + v, 0) / (b - a);
  const bass = avg(0, 10), mid = avg(10, 40), high = avg(40, 64) * 1.6;
  if (raw - prevBass > 0.12) kickEnv = 1; else kickEnv *= 0.84; prevBass = raw;
  out.bands.push(Array.from(bands, v => +v.toFixed(3))); out.bass.push(+bass.toFixed(3)); out.mid.push(+mid.toFixed(3)); out.high.push(+high.toFixed(3)); out.kick.push(+kickEnv.toFixed(3)); out.level.push(+Math.sqrt(rms / N).toFixed(3));
}
fs.writeFileSync('fft-data.js', 'window.FFT=' + JSON.stringify(out) + ';'); console.log('frames', frames, 'sr', sr);
