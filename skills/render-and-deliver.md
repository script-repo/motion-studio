---
name: render-and-deliver
description: Use when a piece is ready to render. Encode MP4 with FFmpeg, make captions with faster-whisper, build contact sheets, and package the delivery.
---

# Render and deliver

Render headless on the build host. Preview small first (half resolution, first few seconds), then final.

## 1. Encode MP4 (H.264)

Final delivery, broad compatibility:

```bash
ffmpeg -y -i master.mov \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 \
  out.mp4
```

| Use | Settings |
| --- | --- |
| Quick preview | `-preset veryfast -crf 28 -vf scale=iw/2:-2` |
| Social (9:16, 1080×1920) | `-crf 20`, 30 fps, keep under platform size limits |
| Archive master | ProRes (`-c:v prores_ks -profile:v 3`) or PNG sequence |
| Loop for web | `-an`, short GOP (`-g 30`), `-movflags +faststart` |

No GPU: stay on `libx264`; limit threads (`-threads N`) if the host is shared.

## 2. Captions with faster-whisper

In the project venv (`skills/build-host-setup.md`):

```python
from faster_whisper import WhisperModel

model = WhisperModel("small", device="cpu", compute_type="int8")
segments, _ = model.transcribe("vo.wav", vad_filter=True, word_timestamps=False)

def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{s:06.3f}".replace(".", ",")

with open("captions.srt", "w") as f:
    for i, s in enumerate(segments, 1):
        f.write(f"{i}\n{ts(s.start)} --> {ts(s.end)}\n{s.text.strip()}\n\n")
```

Proofread the `.srt` against the script. Keep lines to about 42 characters and two lines max.

Burn in:

```bash
ffmpeg -y -i out.mp4 -vf "subtitles=captions.srt:force_style='FontName=Inter,FontSize=22,Outline=2,BorderStyle=1,MarginV=60'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy out_captioned.mp4
```

Or ship as sidecar: deliver `captions.srt` (and `.vtt` via `ffmpeg -i captions.srt captions.vtt`) next to the MP4.

## 3. Stills and contact sheets

Single still at a timestamp:

```bash
ffmpeg -y -ss 00:00:03 -i out.mp4 -frames:v 1 still.png
```

Contact sheet, one frame per second in a 4×3 grid:

```bash
ffmpeg -y -i out.mp4 -vf "fps=1,scale=480:-1,tile=4x3:padding=8:margin=8:color=white" -frames:v 1 contact.png
```

## 4. Interactive HTML

- One self-contained file: inline or vendor scripts, no runtime CDN.
- Honour `prefers-reduced-motion` with a still or slow fallback.
- Start audio only after a user gesture.

## 5. Delivery checklist

- [ ] Named per `templates/file-naming.md`
- [ ] Plays from start to end; last frame holds
- [ ] Text legible at phone size; contrast checked
- [ ] Captions present (burned in or sidecar)
- [ ] Credits file lists assets, fonts, music and voices with licences
- [ ] No secrets or private paths in project files
- [ ] Preview still shown before calling it done
- [ ] Nothing published without the owner's go-ahead
