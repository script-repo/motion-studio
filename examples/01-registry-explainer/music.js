// 01 — Soft music bed for the explainer, rendered offline with Tone.js (12 s, 100 BPM).
import * as Tone from 'tone';
window.renderSong = () => Tone.Offline(() => {
  const verb = new Tone.Reverb({ decay: 4, wet: 0.4 }).toDestination();
  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fattriangle', count: 3, spread: 20 }, envelope: { attack: 1.2, decay: 1, sustain: 0.7, release: 2.5 } }).connect(new Tone.Filter(1800, 'lowpass').connect(verb)); pad.volume.value = -16;
  const pluck = new Tone.PluckSynth({ attackNoise: 0.6, dampening: 3800, resonance: 0.92 }).connect(new Tone.FeedbackDelay('8n', 0.3).connect(verb)); pluck.volume.value = -8;
  const sub = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.02, decay: 0.4, sustain: 0.5, release: 0.8 } }).connect(verb); sub.volume.value = -14;
  const chords = [['D4', 'F#4', 'A4', 'C#5'], ['B3', 'D4', 'F#4', 'A4'], ['G3', 'B3', 'D4', 'F#4'], ['A3', 'C#4', 'E4', 'A4']];
  const roots = ['D2', 'B1', 'G1', 'A1']; const bar = 2.4;
  for (let b = 0; b < 5; b++) { const c = chords[b % 4], t0 = b * bar; pad.triggerAttackRelease(c, bar, t0, 0.5); sub.triggerAttackRelease(roots[b % 4], bar * 0.9, t0, 0.6);
    for (let s = 0; s < 8; s++) if (s % 3 !== 2) pluck.triggerAttack(c[(s * 2 + b) % 4], t0 + s * 0.3 + 0.001); }
  pad.triggerAttackRelease(['D4', 'A4', 'F#5'], 1.5, 11, 0.4);
}, 13, 2, 44100);
