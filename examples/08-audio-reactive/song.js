// 08 — "Signal Bloom": a 12 s, 120 BPM track composed and rendered offline with Tone.js.
import * as Tone from 'tone';
window.renderSong = () => Tone.Offline(({ transport }) => {
  transport.bpm.value = 120;
  const master = new Tone.Compressor(-16, 3).toDestination();
  const verb = new Tone.Reverb({ decay: 3, wet: 0.3 }).connect(master);
  const delay = new Tone.FeedbackDelay('8n.', 0.32).connect(verb); delay.wet.value = 0.25;
  const kick = new Tone.MembraneSynth({ pitchDecay: 0.04, octaves: 6, envelope: { attack: 0.001, decay: 0.42, sustain: 0 } }).connect(master); kick.volume.value = -2;
  const snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 } }).connect(new Tone.Filter(3200, 'bandpass').connect(verb)); snare.volume.value = -8;
  const hat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.045, sustain: 0 } }).connect(new Tone.Filter(9000, 'highpass').connect(master)); hat.volume.value = -20;
  const bass = new Tone.MonoSynth({ oscillator: { type: 'sawtooth' }, filter: { Q: 2, type: 'lowpass' }, filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.3, baseFrequency: 90, octaves: 2.6 }, envelope: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 0.2 } }).connect(master); bass.volume.value = -10;
  const arp = new Tone.FMSynth({ harmonicity: 2, modulationIndex: 6, envelope: { attack: 0.005, decay: 0.25, sustain: 0.1, release: 0.4 }, modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.2 } }).connect(delay); arp.volume.value = -14;
  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', count: 3, spread: 30 }, envelope: { attack: 0.8, decay: 0.5, sustain: 0.7, release: 1.6 } }).connect(new Tone.Filter(1400, 'lowpass').connect(verb)); pad.volume.value = -20;
  const chords = [['A3', 'C4', 'E4', 'G4'], ['F3', 'A3', 'C4', 'E4'], ['C4', 'E4', 'G4', 'B4'], ['G3', 'B3', 'D4', 'F#4']];
  const roots = ['A1', 'F1', 'C2', 'G1'];
  const bar = 2; // seconds per bar at 120 BPM
  for (let b = 0; b < 6; b++) {
    const ch = chords[b % 4], t0 = b * bar;
    pad.triggerAttackRelease(ch, bar * 0.95, t0, 0.6);
    for (let s = 0; s < 16; s++) { // 16th-note arpeggio
      const note = ch[[0, 1, 2, 3, 2, 1, 3, 2][s % 8]]; const up = s % 4 === 3 ? Tone.Frequency(note).transpose(12) : Tone.Frequency(note);
      if (b >= 0) arp.triggerAttackRelease(up, '32n', t0 + s * 0.125, b < 2 ? 0.35 + 0.02 * s : 0.6);
    }
    if (b >= 2) for (let q = 0; q < 4; q++) kick.triggerAttackRelease('C1', '8n', t0 + q * 0.5, 0.95);
    if (b >= 1) for (let q = 0; q < 8; q++) hat.triggerAttackRelease('32n', t0 + q * 0.25 + 0.125, b >= 4 ? 0.9 : 0.5);
    if (b >= 4) { snare.triggerAttackRelease('8n', t0 + 0.5, 0.8); snare.triggerAttackRelease('8n', t0 + 1.5, 0.8); }
    if (b >= 2) [0, 0.75, 1.0, 1.5].forEach((o, i) => bass.triggerAttackRelease(i === 2 ? Tone.Frequency(roots[b % 4]).transpose(12) : roots[b % 4], '8n', t0 + o, 0.9));
  }
}, 12.4, 2, 44100);
