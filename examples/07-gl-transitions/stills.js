// 07 — Four procedural stills, each a single OGL fragment shader (rendered once, screenshotted to PNG).
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { loadFonts } from '../lib/palette.js';
const SCENES = [
  { title: 'Dune', cap: 'WARM LIGHT · LAYERED SAND' },
  { title: 'Aurora', cap: 'NIGHT FIELD · CURTAIN LIGHT' },
  { title: 'Tide', cap: 'TOP-DOWN SURF · DOMAIN WARP' },
  { title: 'Bloom', cap: 'CHROMATIC METABALLS' },
];
const id = +(new URLSearchParams(location.search).get('scene') || 0);
const common = `precision highp float; varying vec2 vUv; uniform vec2 res;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<6;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return s; }
vec3 grain(vec3 c, vec2 uv){ return c + (h(uv*res + 3.1)-.5)*0.035; }
`;
const FRAG = [
`void main(){ vec2 uv=vUv; vec2 p=vec2(uv.x*res.x/res.y, uv.y);
  vec3 sky = mix(vec3(1.0,0.78,0.42), vec3(0.98,0.42,0.36), smoothstep(0.35,1.0,uv.y)); sky = mix(sky, vec3(0.48,0.32,0.62), smoothstep(0.75,1.05,uv.y));
  vec2 sp = vec2(1.25, 0.62); float d = length(p-sp); sky += vec3(1.0,0.9,0.7)*smoothstep(0.13,0.12,d) * 0.9 + vec3(1.,.7,.4)*exp(-d*5.)*0.35;
  vec3 col = sky;
  for(int i=0;i<5;i++){ float fi=float(i); float base = 0.52 - fi*0.1; float y = base + 0.05*sin(p.x*(2.2+fi*0.7)+fi*1.7) + 0.025*sin(p.x*(5.1+fi)+fi*3.) + 0.04*fbm(vec2(p.x*1.5+fi*4., fi));
    vec3 c = mix(vec3(0.98,0.62,0.38), vec3(0.42,0.18,0.30), fi/4.); float slope = cos(p.x*(2.2+fi*0.7)+fi*1.7);
    c *= 0.85 + 0.25*slope; c = mix(c, sky, 0.35*(1.-fi/4.));
    float m = smoothstep(y+0.002, y-0.002, uv.y); col = mix(col, c, m); col += vec3(1.,.85,.6)*0.25*smoothstep(0.006,0.,abs(uv.y-y))*(1.-fi/5.)*m; }
  gl_FragColor = vec4(grain(col, uv),1.); }`,
`void main(){ vec2 uv=vUv; vec2 p=vec2(uv.x*res.x/res.y, uv.y);
  vec3 col = mix(vec3(0.02,0.03,0.09), vec3(0.06,0.08,0.22), uv.y);
  float st = step(0.997, h(floor(uv*res/2.))) * smoothstep(0.3,0.8,uv.y); col += st*0.8;
  for(int i=0;i<3;i++){ float fi=float(i); float x = p.x*1.1 + fi*1.3; float band = 0.48 + fi*0.07 + 0.10*sin(x*1.4+fi*2.) + 0.07*fbm(vec2(x*1.2, fi*3.));
    float d = uv.y - band; float curtain = smoothstep(-0.012, 0.0, d) * exp(-max(d,0.)*(5.5+fi)); float streaks = 0.35+0.65*smoothstep(0.25,0.8,fbm(vec2(x*20., fi*7.)));
    vec3 c = mix(vec3(0.20,1.0,0.62), vec3(0.62,0.36,1.0), smoothstep(0.0,0.28,d)); c = mix(c, vec3(1.0,0.42,0.5), smoothstep(0.25,0.45,d)*0.5);
    col += c * curtain * streaks * (0.62 - fi*0.12); }
  float m1 = 0.25 + 0.08*fbm(vec2(p.x*2.5, 1.)) + 0.06*sin(p.x*1.7); col = mix(col, vec3(0.02,0.02,0.05), smoothstep(m1+0.002, m1-0.002, uv.y));
  float m2 = 0.16 + 0.05*fbm(vec2(p.x*4., 7.)); col = mix(col, vec3(0.0,0.0,0.01), smoothstep(m2+0.002, m2-0.002, uv.y));
  gl_FragColor = vec4(grain(col, uv),1.); }`,
`void main(){ vec2 uv=vUv; vec2 p=vec2(uv.x*res.x/res.y, uv.y)*3.;
  vec2 q = vec2(fbm(p), fbm(p+vec2(5.2,1.3))); vec2 r = vec2(fbm(p+4.*q+vec2(1.7,9.2)), fbm(p+4.*q+vec2(8.3,2.8)));
  float f = fbm(p+4.*r); float shore = uv.x*1.2 + 0.25*fbm(p*0.4) - 0.15;
  vec3 deep=vec3(0.02,0.18,0.32), mid=vec3(0.07,0.55,0.62), shallow=vec3(0.38,0.85,0.80), sand=vec3(0.96,0.88,0.72);
  vec3 col = mix(deep, mid, smoothstep(0.1,0.7,shore + f*0.3)); col = mix(col, shallow, smoothstep(0.65,0.95,shore+f*0.2));
  float foam = smoothstep(0.62,0.7,f) * smoothstep(0.3, 0.8, shore); col = mix(col, vec3(0.97), foam*0.85);
  float wl = fract((shore+f*0.15)*9.); col = mix(col, vec3(0.9,0.98,1.0), smoothstep(0.96,1.,wl)*0.5*smoothstep(0.4,0.9,shore));
  col = mix(col, sand, smoothstep(0.98,1.02,shore+f*0.12)); col *= 0.9+0.2*f;
  gl_FragColor = vec4(grain(col, uv),1.); }`,
`void main(){ vec2 uv=vUv; vec2 p=vec2(uv.x*res.x/res.y, uv.y);
  float v=0.; vec3 acc=vec3(0.);
  vec3 cols[5]; cols[0]=vec3(1.,.42,.36); cols[1]=vec3(.48,.38,1.); cols[2]=vec3(1.,.78,.34); cols[3]=vec3(.18,.77,.71); cols[4]=vec3(.43,.76,1.);
  for(int i=0;i<5;i++){ float fi=float(i); vec2 c = vec2(0.45+fi*0.27 + 0.08*sin(fi*2.3), 0.5+0.22*sin(fi*1.9+0.6)); float r = 0.205+0.05*cos(fi*3.1);
    float w = r*r/max(dot(p-c,p-c),1e-4); v += w; acc += cols[i]*w; }
  vec3 c = acc/v; float edge = smoothstep(1.9,2.05,v); vec3 bg = mix(vec3(0.97,0.94,0.90), vec3(0.93,0.89,0.86), uv.y);
  vec3 col = mix(bg, c*(0.85+0.25*smoothstep(2.,8.,v)), edge); col += vec3(1.)*0.12*smoothstep(4.,12.,v);
  gl_FragColor = vec4(grain(col, uv),1.); }`,
];
const renderer = new Renderer({ width: innerWidth, height: innerHeight, dpr: 1, preserveDrawingBuffer: true });
document.body.prepend(renderer.gl.canvas);
const program = new Program(renderer.gl, { vertex: 'attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,0,1); }', fragment: common + FRAG[id], uniforms: { res: { value: [innerWidth, innerHeight] } } });
renderer.render({ scene: new Mesh(renderer.gl, { geometry: new Triangle(renderer.gl), program }) });
const S = SCENES[id]; document.getElementById('h').textContent = S.title; document.getElementById('p').textContent = S.cap;
document.getElementById('n').textContent = `Nº 07 · ${id + 1} / 4`;
if (id === 2) { const e = document.getElementById('n'); e.style.color = '#0B1020'; e.style.textShadow = 'none'; }
if (id === 3) document.querySelectorAll('.t,.n').forEach(e => { e.style.color = '#0B1020'; e.style.textShadow = 'none'; });
loadFonts(['700 150px "Space Grotesk"', '500 20px "JetBrains Mono"']).then(() => window.__ready = true);
