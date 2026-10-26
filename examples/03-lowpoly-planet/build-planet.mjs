// 03 — Procedurally generate a low-poly planet mesh and write it as an optimized GLB with glTF Transform.
import { Document, NodeIO } from '@gltf-transform/core';
import { KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, dedup, quantize, prune } from '@gltf-transform/functions';
import fs from 'fs';
// --- icosphere ---
const t = (1 + Math.sqrt(5)) / 2;
let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(n);
let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
function n(v) { const l = Math.hypot(...v); return v.map(x => x / l); }
for (let s = 0; s < 4; s++) {
  const cache = new Map(), NF = [];
  const mid = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (!cache.has(k)) { V.push(n(V[a].map((x, i) => (x + V[b][i]) / 2))); cache.set(k, V.length - 1); } return cache.get(k); };
  for (const [a, b, c] of F) { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); NF.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); }
  F = NF;
}
// --- deterministic 3D value noise (fbm) ---
const hash = (x, y, z) => { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = x => x * x * (3 - 2 * x);
function vnoise(x, y, z) { const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z); const fx = sm(x - X), fy = sm(y - Y), fz = sm(z - Z); let r = 0;
  for (let i = 0; i < 8; i++) { const dx = i & 1, dy = (i >> 1) & 1, dz = (i >> 2) & 1; r += hash(X + dx, Y + dy, Z + dz) * (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy) * (dz ? fz : 1 - fz); } return r; }
const fbm = (x, y, z) => { let a = 0.5, s = 0, f = 1.6; for (let o = 0; o < 5; o++) { s += a * vnoise(x * f + 11, y * f + 7, z * f + 3); a *= 0.5; f *= 2.03; } return s; };
const elev = V.map(v => fbm(...v));
const SEA = 0.5;
const P = V.map((v, i) => { const e = Math.max(elev[i], SEA); const r = 1 + (e - SEA) * 0.55; return v.map(x => x * r); });
// palette by face elevation (flat colour per face => crisp low-poly look)
const pal = [[0.0, [0.05, 0.18, 0.42]], [0.5, [0.12, 0.55, 0.72]], [0.515, [0.98, 0.80, 0.52]], [0.56, [0.18, 0.72, 0.58]], [0.64, [0.42, 0.33, 0.78]], [0.72, [0.98, 0.95, 0.92]]];
const col = e => { let c = pal[0][1]; for (const [k, v] of pal) if (e >= k) c = v; return c; };
const pos = [], colr = [];
for (const f of F) { const e = (elev[f[0]] + elev[f[1]] + elev[f[2]]) / 3; const c = col(e); for (const i of f) { pos.push(...P[i]); colr.push(...c, 1); } }
// --- glTF Transform document ---
const doc = new Document(); const buf = doc.createBuffer();
const prim = doc.createPrimitive()
  .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos)).setBuffer(buf))
  .setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(new Float32Array(colr)).setBuffer(buf))
  .setMaterial(doc.createMaterial('planet').setRoughnessFactor(0.85).setMetallicFactor(0));
const mesh = doc.createMesh('Planet').addPrimitive(prim);
doc.createScene().addChild(doc.createNode('Planet').setMesh(mesh));
const io = new NodeIO().registerExtensions([KHRMeshQuantization]);
const raw = await io.writeBinary(doc);
await doc.transform(weld(), dedup(), quantize({ quantizePosition: 14, quantizeColor: 8 }), prune());
const opt = await io.writeBinary(doc);
fs.writeFileSync('planet.glb', opt);
const report = `faces=${F.length} raw=${raw.byteLength}B optimized=${opt.byteLength}B (${(100 * opt.byteLength / raw.byteLength).toFixed(1)}%)`;
fs.writeFileSync('gltf-transform-report.txt', report + '\n'); console.log(report);
// embed for file:// loading
fs.writeFileSync('planet-glb.js', 'window.PLANET_GLB="' + Buffer.from(opt).toString('base64') + '";');
