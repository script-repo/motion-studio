// 01 — "What a capability registry does": Remotion kinetic-typography explainer.
// Voice: Chatterbox TTS · captions: faster-whisper word timings · music bed: Tone.js · mix/encode: FFmpeg.
import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import captions from './captions.json';
const C = { ink: '#0B1020', ink2: '#141B33', cream: '#F4EFE6', coral: '#FF6B5B', amber: '#FFC857', teal: '#2EC4B6', violet: '#7B61FF', sky: '#6EC1FF', mist: '#9AA3C7' };
const VOICE_OFFSET = 1.0; // seconds of music before the voice starts
const words = captions.words.map((w) => ({ ...w, s: w.s + VOICE_OFFSET, e: w.e + VOICE_OFFSET }));
const at = (needle: string, fallback: number) => { const w = words.find((x) => x.w.toLowerCase().replace(/[^a-z]/g, '') === needle); return w ? w.s : fallback; };
const T_EVERY = at('every', 4.2), T_AGENTS = at('agents', 6.6), T_INSTANT = at('instantly', 8.4), T_END = words.length ? words[words.length - 1].e : 8.8;
const fontCss = `
@font-face{font-family:'SG';font-weight:500;src:url(${staticFile('fonts/space-grotesk-latin-500-normal.woff2')})}
@font-face{font-family:'SG';font-weight:700;src:url(${staticFile('fonts/space-grotesk-latin-700-normal.woff2')})}
@font-face{font-family:'IN';font-weight:400;src:url(${staticFile('fonts/inter-latin-400-normal.woff2')})}
@font-face{font-family:'IN';font-weight:600;src:url(${staticFile('fonts/inter-latin-600-normal.woff2')})}
@font-face{font-family:'IN';font-weight:800;src:url(${staticFile('fonts/inter-latin-800-normal.woff2')})}
@font-face{font-family:'JB';font-weight:500;src:url(${staticFile('fonts/jetbrains-mono-latin-500-normal.woff2')})}`;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const TOOLS = [
  { name: 'Render', cap: 'render.video', color: C.coral, x: 250, y: 300 },
  { name: 'Search', cap: 'web.search', color: C.amber, x: 830, y: 300 },
  { name: 'Translate', cap: 'text.translate', color: C.teal, x: 830, y: 700 },
  { name: 'Mail', cap: 'email.send', color: C.sky, x: 250, y: 700 },
];
const REG = { x: 540, y: 500 };
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, startSec: number, cfg = {}) => spring({ frame: f - startSec * fps, fps, config: { damping: 14, stiffness: 140, mass: 0.8, ...cfg } });

const Grid: React.FC = () => {
  const { t } = useT();
  return <svg width={1080} height={1080} style={{ position: 'absolute', opacity: 0.5 }}>
    {Array.from({ length: 19 }).map((_, i) => Array.from({ length: 19 }).map((_, j) => {
      const d = Math.hypot(i * 60 - 540, j * 60 - 540); const pulse = 0.25 + 0.75 * Math.max(0, Math.sin(t * 2 - d / 90));
      return <circle key={i + '-' + j} cx={i * 60} cy={j * 60} r={1.6} fill={C.mist} opacity={0.18 + 0.25 * pulse} />;
    }))}
  </svg>;
};

const Registry: React.FC = () => {
  const { f, fps, t } = useT();
  const s = sp(f, fps, 0.35); const outro = interpolate(t, [T_END + 0.2, T_END + 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const query = interpolate(t, [T_AGENTS + 0.2, T_AGENTS + 1.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rows = TOOLS.map((tool, i) => {
    const on = interpolate(t, [T_EVERY + 0.25 + i * 0.28, T_EVERY + 0.55 + i * 0.28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
    const hit = i === 0 ? interpolate(t, [T_AGENTS + 1.1, T_AGENTS + 1.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
    return { ...tool, on, hit };
  });
  return <div style={{ position: 'absolute', left: REG.x - 190, top: REG.y - 150, width: 380, height: 300, transform: `scale(${s * (1 - 0.25 * outro)}) translateY(${-outro * 260}px)`, opacity: 1 - outro * 0.9,
    background: C.ink2, borderRadius: 28, boxShadow: `0 30px 80px rgba(0,0,0,.45), 0 0 0 1.5px rgba(154,163,199,.25), 0 0 ${40 * query}px rgba(255,200,87,${0.35 * query})`, padding: 26, boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${C.violet}, ${C.sky})` }} />
      <div style={{ font: "700 26px SG", color: C.cream }}>Registry</div>
      <div style={{ marginLeft: 'auto', font: '500 14px JB', color: C.mist, letterSpacing: '.1em' }}>{rows.filter(r => r.on > 0.5).length} / 4</div>
    </div>
    {rows.map((r, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', height: 50, padding: '0 14px', marginBottom: 6, borderRadius: 12,
      background: r.hit ? `rgba(255,107,91,${0.18 * r.hit})` : 'rgba(255,255,255,.035)', opacity: 0.15 + 0.85 * r.on, transform: `translateX(${(1 - r.on) * 24}px)`,
      boxShadow: r.hit ? `inset 0 0 0 1.5px rgba(255,107,91,${r.hit})` : 'none' }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: r.color, marginRight: 12 }} />
      <div style={{ font: '500 17px JB', color: C.cream }}>{r.cap}</div>
      <div style={{ marginLeft: 'auto', font: '400 15px IN', color: C.mist }}>{r.name}</div>
    </div>)}
  </div>;
};

const Tools: React.FC = () => {
  const { f, fps, t } = useT();
  const outro = interpolate(t, [T_END + 0.1, T_END + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <>
    <svg width={1080} height={1080} style={{ position: 'absolute' }}>
      {TOOLS.map((tool, i) => { const p = interpolate(t, [T_EVERY + 0.1 + i * 0.28, T_EVERY + 0.6 + i * 0.28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const ex = REG.x + (tool.x < REG.x ? -190 : 190), ey = tool.y < REG.y ? REG.y - 60 : REG.y + 60; const x2 = tool.x + (ex - tool.x) * p, y2 = tool.y + (ey - tool.y) * p;
        return <g key={i} opacity={1 - outro}><line x1={tool.x} y1={tool.y} x2={x2} y2={y2} stroke={tool.color} strokeWidth={2.5} strokeDasharray="2 9" strokeLinecap="round" />
          {p > 0.02 && p < 0.999 && <circle cx={x2} cy={y2} r={6} fill={tool.color} />}</g>; })}
    </svg>
    {TOOLS.map((tool, i) => { const s = sp(f, fps, T_EVERY - 0.15 + i * 0.18, { damping: 11 });
      return <div key={i} style={{ position: 'absolute', left: tool.x - 85, top: tool.y - 34, width: 170, height: 68, borderRadius: 34, background: C.cream, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', boxSizing: 'border-box',
        transform: `scale(${s * (1 - outro)})`, boxShadow: '0 16px 40px rgba(0,0,0,.35)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: tool.color }} /><div style={{ font: '600 21px IN', color: C.ink }}>{tool.name}</div></div>; })}
  </>;
};

const Agent: React.FC = () => {
  const { f, fps, t } = useT();
  const s = sp(f, fps, T_AGENTS - 0.2, { damping: 12 }); const outro = interpolate(t, [T_END + 0.1, T_END + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ask = interpolate(t, [T_AGENTS + 0.25, T_AGENTS + 1.05], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const back = interpolate(t, [T_AGENTS + 1.35, T_AGENTS + 2.0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const ax = 540, ay = 880, top = REG.y + 150;
  const ok = sp(f, fps, T_AGENTS + 1.9, { damping: 10 });
  return <div style={{ position: 'absolute', inset: 0, opacity: 1 - outro }}>
    <svg width={1080} height={1080} style={{ position: 'absolute' }}>
      <line x1={ax - 16} y1={ay - 40} x2={ax - 16} y2={ay - 40 - (ay - 40 - top) * ask} stroke={C.amber} strokeWidth={3} strokeLinecap="round" opacity={s} />
      <line x1={ax + 16} y1={top} x2={ax + 16} y2={top + (ay - 40 - top) * back} stroke={C.coral} strokeWidth={3} strokeLinecap="round" opacity={back > 0 ? 1 : 0} />
    </svg>
    <div style={{ position: 'absolute', left: ax - 62 - 210, top: ay - 108 - 22 + (1 - ask) * 0, font: '500 16px JB', color: C.amber, opacity: ask * (1 - back), letterSpacing: '.04em' }}>needs: render.video →</div>
    <div style={{ position: 'absolute', left: ax + 50, top: ay - 108 - 22, font: '500 16px JB', color: C.coral, opacity: back, letterSpacing: '.04em', transform: `scale(${0.9 + 0.1 * ok})`, transformOrigin: 'left center' }}>✓ Render · 12 ms</div>
    <div style={{ position: 'absolute', left: ax - 95, top: ay - 38, width: 190, height: 76, borderRadius: 20, background: `linear-gradient(135deg, ${C.violet}, #5A47D6)`, transform: `scale(${s})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 20px 50px rgba(123,97,255,.45)' }}>
      <svg width={30} height={30} viewBox="0 0 30 30"><rect x={3} y={7} width={24} height={18} rx={6} fill={C.cream} /><circle cx={11} cy={16} r={2.6} fill={C.violet} /><circle cx={19} cy={16} r={2.6} fill={C.violet} /><rect x={13.5} y={1} width={3} height={6} rx={1.5} fill={C.cream} /></svg>
      <div style={{ font: '700 24px SG', color: C.cream }}>Agent</div></div>
  </div>;
};

const Headline: React.FC = () => {
  const { t, f, fps } = useT();
  // scene labels, kinetic
  const label = t < T_EVERY - 0.1 ? 'One source of truth' : t < T_AGENTS - 0.1 ? 'Tools declare capabilities' : 'Agents discover them';
  const start = t < T_EVERY - 0.1 ? 0.2 : t < T_AGENTS - 0.1 ? T_EVERY - 0.1 : T_AGENTS - 0.1;
  const s = sp(f, fps, start, { damping: 16 }); const outro = interpolate(t, [T_END + 0.05, T_END + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', left: 80, top: 86, opacity: 1 - outro }}>
    <div style={{ font: '500 17px JB', letterSpacing: '.18em', color: C.mist }}>MOTION STUDIO · EXPLAINER Nº 01</div>
    <div style={{ font: '700 52px SG', color: C.cream, marginTop: 14, letterSpacing: '-.02em', overflow: 'hidden', height: 64 }}>
      <div style={{ transform: `translateY(${(1 - s) * 64}px)` }}>{label}<span style={{ color: C.amber }}>.</span></div></div>
  </div>;
};

const Outro: React.FC = () => {
  const { t, f, fps } = useT();
  const words1 = ['Capability', 'Registry'];
  const s0 = T_END + 0.55;
  const tag = interpolate(t, [s0 + 0.9, s0 + 1.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  if (t < s0 - 0.1) return null;
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    <div style={{ display: 'flex', gap: 26 }}>{words1.map((w, i) => { const s = sp(f, fps, s0 + i * 0.16, { damping: 13 });
      return <div key={w} style={{ overflow: 'hidden', height: 120 }}><div style={{ font: '700 104px SG', letterSpacing: '-.04em', color: i ? C.amber : C.cream, transform: `translateY(${(1 - s) * 120}px)` }}>{w}</div></div>; })}</div>
    <div style={{ font: '400 32px IN', color: C.mist, marginTop: 18, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>Declare once. Discover everywhere.</div>
    <div style={{ width: 120 * tag, height: 4, borderRadius: 2, background: C.coral, marginTop: 34 }} />
  </AbsoluteFill>;
};

const Captions: React.FC = () => {
  const { t } = useT();
  // group words into lines of up to ~5 words, show the line containing the current word
  const lines: typeof words[] = []; let cur: typeof words = [];
  for (const w of words) { cur.push(w); if (cur.length >= 5 || /[.,]$/.test(w.w)) { lines.push(cur); cur = []; } }
  if (cur.length) lines.push(cur);
  const line = lines.find((l) => t >= l[0].s - 0.15 && t <= l[l.length - 1].e + 0.25);
  if (!line) return null;
  const a = Math.min(1, (t - (line[0].s - 0.15)) / 0.15, (line[line.length - 1].e + 0.25 - t) / 0.15);
  return <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', opacity: a }}>
    <div style={{ background: 'rgba(11,16,32,.82)', borderRadius: 18, padding: '14px 26px', display: 'flex', gap: 11, boxShadow: '0 0 0 1px rgba(154,163,199,.18)' }}>
      {line.map((w, i) => { const on = t >= w.s; const now = t >= w.s && t <= w.e + 0.05;
        return <span key={i} style={{ font: '600 34px IN', color: now ? C.amber : on ? C.cream : 'rgba(244,239,230,.38)', transform: `translateY(${now ? -2 : 0}px)` }}>{w.w}</span>; })}
    </div></div>;
};

export const Explainer: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, #1A2246 0%, ${C.ink} 62%)` }}>
    <style>{fontCss}</style>
    <Grid /><Tools /><Registry /><Agent /><Headline /><Outro /><Captions />
    <Audio src={staticFile('mix.wav')} />
  </AbsoluteFill>
);
