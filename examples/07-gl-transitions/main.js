// 07 — Four OGL-rendered stills joined by three GL Transitions shaders (CrossWarp, DirectionalWarp, Swirl), rendered in WebGL with OGL.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import transitions from 'gl-transitions';
const HOLD = 2.1, TR = 1.2, NAMES = ['CrossWarp', 'DirectionalWarp', 'Swirl'];
const renderer = new Renderer({ width: innerWidth, height: innerHeight, dpr: 1, preserveDrawingBuffer: true });
const gl = renderer.gl; document.body.prepend(gl.canvas);
const geometry = new Triangle(gl);
const vertex = 'attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0,1); }';
const head = `precision highp float; varying vec2 vUv; uniform sampler2D from, to; uniform float progress, ratio, zf, zt;
vec2 kb(vec2 uv, float z){ return (uv-0.5)/z+0.5; }
vec4 getFromColor(vec2 uv){ return texture2D(from, kb(uv, zf)); } vec4 getToColor(vec2 uv){ return texture2D(to, kb(uv, zt)); }
`;
const meshes = NAMES.map(n => { const tr = transitions.find(t => t.name === n);
  const uniforms = { from: { value: null }, to: { value: null }, progress: { value: 0 }, ratio: { value: innerWidth / innerHeight }, zf: { value: 1 }, zt: { value: 1 } };
  for (const [k, v] of Object.entries(tr.defaultParams || {})) uniforms[k] = { value: v };
  return new Mesh(gl, { geometry, program: new Program(gl, { vertex, fragment: head + tr.glsl + '\nvoid main(){ gl_FragColor = transition(vUv); }', uniforms }) }); });
const textures = [];
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
Promise.all(window.STILLS.map(src => new Promise(r => { const img = new Image(); img.onload = () => r(new Texture(gl, { image: img, generateMipmaps: false, minFilter: gl.LINEAR })); img.src = src; })))
  .then(t => { textures.push(...t); window.__ready = true; });
const span = HOLD + TR; // each still is visible from k*span - TR .. (k+1)*span
const zoom = (k, t) => 1.0 + 0.04 * Math.max(0, Math.min(1, (t - (k * span - TR)) / (span + TR)));
window.renderFrame = (t) => {
  let k = Math.min(3, Math.floor(t / span)); const local = t - k * span; let p = 0, mi = Math.min(2, k);
  if (k < 3 && local > HOLD) p = ease((local - HOLD) / TR); else if (k === 3) { p = 0; mi = 2; }
  const m = meshes[Math.min(2, k)]; const from = k, to = Math.min(3, k + 1);
  m.program.uniforms.from.value = textures[from]; m.program.uniforms.to.value = textures[to]; m.program.uniforms.progress.value = k === 3 ? 0 : p;
  m.program.uniforms.zf.value = zoom(from, t); m.program.uniforms.zt.value = zoom(to, t);
  renderer.render({ scene: m });
  const tag = document.getElementById('tag');
  const inT = k < 3 && local > HOLD - 0.35 && local < HOLD + TR + 0.35; tag.style.opacity = inT ? Math.min(1, Math.min(local - (HOLD - 0.35), HOLD + TR + 0.35 - local) / 0.3) : 0;
  if (k < 3) document.getElementById('tn').textContent = NAMES[k];
};
