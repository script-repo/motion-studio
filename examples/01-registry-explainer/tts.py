# 01 — Voiceover with Chatterbox TTS (resemble-ai/chatterbox) on CPU.
import sys, time, torch, torchaudio
from chatterbox.tts import ChatterboxTTS
TEXT = ("A capability registry is one source of truth. "
        "Every tool declares what it can do. "
        "Agents ask the registry, and get the right capability, instantly.")
t = time.time()
model = ChatterboxTTS.from_pretrained(device="cpu")
print("loaded in", round(time.time() - t, 1), "s", flush=True)
torch.manual_seed(7)
wav = model.generate(TEXT, exaggeration=0.45, cfg_weight=0.5, temperature=0.7)
torchaudio.save("audio/voice.wav", wav, model.sr)
print("generated in", round(time.time() - t, 1), "s; duration", wav.shape[-1] / model.sr, flush=True)
