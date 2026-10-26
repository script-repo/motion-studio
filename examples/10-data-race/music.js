// 10 — Driving music bed for the bar-chart race, Tone.js offline render (12 s, 120 BPM).
import * as Tone from 'tone';
window.renderSong = () => Tone.Offline(() => {
  const out = new Tone.Compressor(-18, 3).toDestination(); const verb = new Tone.Reverb({ decay: 2.2, wet: 0.25 }).connect(out);
  const kick = new Tone.MembraneSynth({ octaves: 4, envelope: { attack: 0.001, decay: 0.3, sustain: 0 } }).connect(out); kick.volume.value = -10;
  const hat = new Tone.NoiseSynth({ envelope: { attack: 0.001, decay: 0.03, sustain: 0 } }).connect(new Tone.Filter(8000, 'highpass').connect(out)); hat.volume.value = -26;
  const seq = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.002, decay: 0.12, sustain: 0, release: 0.05 } }).connect(new Tone.Filter(2200, 'lowpass').connect(new Tone.FeedbackDelay('8n', 0.25).connect(verb))); seq.volume.value = -20;
  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', count: 3, spread: 25 }, envelope: { attack: 0.6, decay: 0.4, sustain: 0.6, release: 1.5 } }).connect(new Tone.Filter(1200, 'lowpass').connect(verb)); pad.volume.value = -24;
  const ch = [['E3', 'G3', 'B3', 'D4'], ['C3', 'E3', 'G3', 'B3'], ['G2', 'B2', 'D3', 'F#3'], ['D3', 'F#3', 'A3', 'C#4']];
  for (let b = 0; b < 6; b++) { const t0 = b * 2, c = ch[b % 4]; pad.triggerAttackRelease(c, 1.9, t0, 0.5);
    for (let s = 0; s < 16; s++) { seq.triggerAttackRelease(Tone.Frequency(c[(s * 3) % 4]).transpose(12), '32n', t0 + s * 0.125, s % 4 === 0 ? 0.8 : 0.45); if (s % 2) hat.triggerAttackRelease('32n', t0 + s * 0.125, 0.6); }
    if (b >= 1 && b < 5) for (let q = 0; q < 4; q++) kick.triggerAttackRelease('C1', '8n', t0 + q * 0.5, 0.8); }
  pad.triggerAttackRelease(['E3', 'B3', 'G4'], 1.5, 11.0, 0.5);
}, 12.6, 2, 44100);
