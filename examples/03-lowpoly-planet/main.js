// 03 — Glowing low-poly planet (GLB generated + optimized with glTF Transform) and a Keplerian particle ring, Three.js + bloom.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { loadFonts } from '../lib/palette.js';
const W = innerWidth, H = innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#05070F');
const cam = new THREE.PerspectiveCamera(34, W / H, 0.1, 200); cam.position.set(0, 1.3, 7.2); cam.lookAt(0, 0, 0);
// rand
let seed = 1234; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
// stars
{ const g = new THREE.BufferGeometry(), p = [], c = []; for (let i = 0; i < 2500; i++) { const v = new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize().multiplyScalar(60 + rnd() * 40); p.push(v.x, v.y, v.z); const b = 0.4 + rnd() * 0.6; c.push(b, b, b * 1.1); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.8 }))); }
// lights
scene.add(new THREE.HemisphereLight('#7B61FF', '#0B1020', 0.55));
const sun = new THREE.DirectionalLight('#FFE7C2', 2.3); sun.position.set(-5, 3, 4); scene.add(sun);
const rim = new THREE.DirectionalLight('#2EC4B6', 1.6); rim.position.set(4, -1, -4); scene.add(rim);
const tilt = new THREE.Group(); tilt.rotation.set(0.38, 0, -0.32); scene.add(tilt);
const spin = new THREE.Group(); tilt.add(spin);
// atmosphere (fresnel shell)
const atmo = new THREE.Mesh(new THREE.IcosahedronGeometry(1.42, 5), new THREE.ShaderMaterial({
  transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
  uniforms: { c1: { value: new THREE.Color('#6EC1FF') }, c2: { value: new THREE.Color('#7B61FF') } },
  vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'uniform vec3 c1; uniform vec3 c2; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.2); float g = smoothstep(0.0,1.0,f); gl_FragColor = vec4(mix(c2,c1,g)*g*1.4, g); }'
})); tilt.add(atmo);
// particle ring (Keplerian: angular speed ~ r^-1.5)
const N = 9000, rg = new THREE.BufferGeometry(), r0 = new Float32Array(N), a0 = new Float32Array(N), h0 = new Float32Array(N), cs = new Float32Array(N * 3), sz = new Float32Array(N);
const ringCols = ['#FFC857', '#FF6B5B', '#F4EFE6', '#FF9F68'].map(c => new THREE.Color(c));
for (let i = 0; i < N; i++) { const band = rnd(); r0[i] = band < 0.62 ? 1.9 + Math.pow(rnd(), 1.4) * 0.75 : 2.8 + rnd() * 0.55; a0[i] = rnd() * Math.PI * 2; h0[i] = (rnd() - 0.5) * 0.05 * (r0[i] - 1.2);
  const c = ringCols[Math.floor(rnd() * ringCols.length)]; cs.set([c.r, c.g, c.b], i * 3); sz[i] = 2.0 + rnd() * 4.5; }
rg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); rg.setAttribute('color', new THREE.BufferAttribute(cs, 3)); rg.setAttribute('size', new THREE.BufferAttribute(sz, 1));
const ringMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
  vertexShader: 'attribute float size; varying vec3 vC; void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=size*(6.0/-mv.z); gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'varying vec3 vC; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d); gl_FragColor=vec4(vC*a*0.9,a); }' });
const ring = new THREE.Points(rg, ringMat); tilt.add(ring);
let planet;
new GLTFLoader().parse(Uint8Array.from(atob(window.PLANET_GLB), c => c.charCodeAt(0)).buffer, '', async gltf => {
  planet = gltf.scene; planet.scale.setScalar(1.2);
  planet.traverse(o => { if (o.isMesh) { o.material = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.8, metalness: 0.05, emissive: new THREE.Color('#1a1050'), emissiveIntensity: 0.35 }); } });
  spin.add(planet);
  await loadFonts(['700 64px "Space Grotesk"', '500 18px "JetBrains Mono"']);
  window.__ready = true;
});
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, cam));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.7, 0.55, 0.72)); composer.addPass(new OutputPass());
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
window.renderFrame = (t) => {
  spin.rotation.y = t * 0.36;
  const pa = rg.attributes.position.array;
  for (let i = 0; i < N; i++) { const w = 0.9 * Math.pow(r0[i] / 1.9, -1.5); const a = a0[i] + t * w; pa[i * 3] = Math.cos(a) * r0[i]; pa[i * 3 + 1] = h0[i]; pa[i * 3 + 2] = Math.sin(a) * r0[i]; }
  rg.attributes.position.needsUpdate = true;
  // slow cinematic dolly: push in over 10 s
  const k = ease(Math.min(1, t / 10)); cam.position.set(Math.sin(t * 0.12) * 0.8, 1.6 - 0.5 * k, 9.8 - 1.7 * k); cam.lookAt(0, -0.05, 0);
  composer.render();
};
