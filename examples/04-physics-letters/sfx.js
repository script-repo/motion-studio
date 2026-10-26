// 04 — Impact sound design: Tone.js renders offline, one hit per Rapier collision event.
import * as Tone from 'tone';
import sim from './sim.json';
window.renderSong = () => Tone.Offline(() => {
  const rev = new Tone.Reverb({ decay: 1.6, wet: 0.22 }).toDestination();
  const comp = new Tone.Compressor(-18, 4).connect(rev);
  const thump = new Tone.MembraneSynth({ pitchDecay: 0.03, octaves: 5, envelope: { attack: 0.001, decay: 0.32, sustain: 0, release: 0.1 } }).connect(comp);
  const click = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0 } }).connect(new Tone.Filter(2400, 'bandpass').connect(comp));
  const tick = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.12 } }).connect(comp);
  const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sine' }, envelope: { attack: 1.5, decay: 1, sustain: 0.6, release: 2 } }).connect(rev);
  pad.volume.value = -22; pad.triggerAttackRelease(['C3', 'G3', 'E4'], 9, 0.1);
  const scale = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6'];
  let last = -1;
  for (const e of sim.events) {
    const vel = Math.min(1, e.v / 14);
    if (e.big) { thump.triggerAttackRelease(e.v > 8 ? 'C2' : 'G2', 0.3, e.t, 0.5 + 0.5 * vel); click.triggerAttackRelease(0.04, e.t, 0.3 * vel); }
    else if (e.t - last > 0.05) { tick.triggerAttackRelease(scale[Math.floor(e.x * scale.length) % scale.length], 0.15, e.t, 0.25 + 0.4 * vel); last = e.t; }
  }
}, 11, 2, 44100);
