# 01 — Word-level caption timing with faster-whisper (CPU, int8).
import json, time, subprocess
import numpy as np
from faster_whisper import WhisperModel
t = time.time()
model = WhisperModel("small.en", device="cpu", compute_type="int8")
# decode with FFmpeg to 16 kHz mono float32 (avoids a PyAV API mismatch)
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", "audio/voice.wav", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)
segs, info = model.transcribe(audio, word_timestamps=True, beam_size=5)
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump({"words": words}, open("src/captions.json", "w"), indent=1)
print(len(words), "words in", round(time.time() - t, 1), "s:", " ".join(w["w"] for w in words))
