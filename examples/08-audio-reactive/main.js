// 08 — OGL fragment-shader visualizer driven per frame by the precomputed FFT of the Tone.js track.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { loadFonts } from '../lib/palette.js';
const F = window.FFT, NB = 64;
const renderer = new Renderer({ width: innerWidth, height: innerHeight, dpr: 1, preserveDrawingBuffer: true });
const gl = renderer.gl; document.body.prepend(gl.canvas);
const data = new Uint8Array(NB * 4);
const spec = new Texture(gl, { image: data, width: NB, height: 1, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, flipY: false });
const program = new Program(gl, {
  vertex: 'attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0,1); }',
  fragment: `precision highp float; varying vec2 vUv; uniform sampler2D spec; uniform float t, bass, mid, high, kick, level; uniform vec2 res;
  #define PI 3.14159265
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.02+3.1; a*=.5; } return s; }
  float S(float u){ return texture2D(spec, vec2(clamp(u*0.8,0.,1.)*0.98+0.01, .5)).r; }
  void main(){
    vec2 p = (vUv-.5)*vec2(res.x/res.y,1.); p.y -= 0.04; float r = length(p), a = atan(p.x, p.y);
    float u = abs(a)/PI;                    // mirrored angle -> band (low at top)
    // nebula background
    vec2 q = p*2.2; float w = fbm(q + vec2(fbm(q + t*0.08), fbm(q - t*0.06)) * 1.6 + t*0.03);
    vec3 col = mix(vec3(0.02,0.025,0.06), vec3(0.20,0.12,0.42), w*w*(0.5+0.9*mid)) + vec3(0.03,0.15,0.18)*smoothstep(0.5,0.9,w)*high*1.5;
    col *= 1.0 - smoothstep(0.35, 0.95, r);
    // spoke bars
    float N = 120.; float seg = fract(u*N*0.5 + 0.5); float su = (floor(u*N*0.5)+0.5)/(N*0.5);
    float sv = S(su); float R1 = 0.25 + 0.015*bass; float len = 0.012 + sv*sv*0.17;
    float bar = smoothstep(0.32,0.38,seg)*smoothstep(0.68,0.62,seg) * smoothstep(R1-0.004,R1,r) * smoothstep(R1+len+0.004, R1+len, r);
    vec3 bc = mix(vec3(1.,0.42,0.36), vec3(1.,0.78,0.34), su*1.4); bc = mix(bc, vec3(0.18,0.77,0.71), smoothstep(0.5,1.,su));
    col += bc * bar * (0.55 + 0.6*sv);
    // glowing spectral ring
    float rr = 0.225 + 0.035*S(u) + 0.008*sin(a*6. + t*2.);
    col += mix(vec3(0.48,0.38,1.), vec3(0.43,0.76,1.), u) * (0.0035/abs(r-rr)) * (0.45+0.8*level*3.);
    // kick shockwave
    float sw = 0.22 + (1.-kick)*0.55; col += vec3(1.,0.55,0.45) * kick*kick * 0.006/abs(r - sw) * smoothstep(0.95,0.3,r);
    // core orb
    float R0 = 0.15 + 0.035*bass + 0.03*kick; float orb = smoothstep(R0, R0-0.006, r);
    float surf = fbm(p*7. + t*0.4 + kick);
    vec3 oc = mix(vec3(1.,0.78,0.34), vec3(1.,0.36,0.34), smoothstep(0.,R0,r) + 0.25*surf);
    col = mix(col, oc*(0.75+0.5*surf), orb); col += vec3(1.,0.55,0.4)*exp(-r*9.)*(0.25+0.6*kick);
    col += (h(vUv*res + t)-.5)*0.03;
    gl_FragColor = vec4(pow(col, vec3(0.95)), 1.);
  }`,
  uniforms: { spec: { value: spec }, t: { value: 0 }, bass: { value: 0 }, mid: { value: 0 }, high: { value: 0 }, kick: { value: 0 }, level: { value: 0 }, res: { value: [innerWidth, innerHeight] } },
});
const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
window.renderFrame = (t) => {
  const f = Math.min(F.bass.length - 1, Math.round(t * F.fps)); const U = program.uniforms;
  for (let i = 0; i < NB; i++) { const v = Math.round(F.bands[f][i] * 255); data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v; data[i * 4 + 3] = 255; }
  spec.image = data; spec.needsUpdate = true;
  U.t.value = t; U.bass.value = F.bass[f]; U.mid.value = F.mid[f]; U.high.value = F.high[f]; U.kick.value = F.kick[f]; U.level.value = F.level[f];
  renderer.render({ scene: mesh });
  document.getElementById('mb').style.height = (F.bass[f] * 100) + '%'; document.getElementById('mm').style.height = (F.mid[f] * 100) + '%'; document.getElementById('mh').style.height = (Math.min(1, F.high[f] * 2) * 100) + '%';
  document.getElementById('clock').textContent = `00:${String(Math.floor(t)).padStart(2, '0')}.${Math.floor((t % 1) * 10)}`;
};
loadFonts(['700 60px "Space Grotesk"', '500 17px "JetBrains Mono"']).then(() => { window.renderFrame(0); window.__ready = true; });
