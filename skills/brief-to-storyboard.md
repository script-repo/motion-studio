---
name: brief-to-storyboard
description: Use when a new motion brief arrives. Turn it into a one-line story, beats, a storyboard and a style frame before building anything longer than about 15 seconds.
---

# Brief to storyboard

## 1. Read the brief for the story

Fill these from the brief (`templates/brief.md`). Guess sensibly; ask only if a wrong guess would waste a long render or change the deliverable.

| Field | Question | Default if missing |
| --- | --- | --- |
| Audience | Who watches, and where? | General audience on a phone |
| Single idea | What one feeling or idea should stick? | Write one and state it back |
| Length | Seconds | 15 s |
| Format | Aspect and resolution | 1080×1920 (9:16) for social, 1920×1080 (16:9) otherwise |
| Delivery | MP4, interactive HTML, stills, or all | MP4 + PNG still |
| Sound | Voiceover, music, SFX, silent | Silent with captions-ready layout |
| Must avoid | Brands, people, colours, claims | No real brands or people |

## 2. One-line story

> For **<audience>**, this **<length>** piece makes them feel/understand **<single idea>** by showing **<core visual metaphor>**.

## 3. Beats

Split the length into 3–6 beats. Rule of thumb: hook in the first 1–2 s, one idea per beat, a clear ending frame that holds at least 1 s.

| # | Time | On screen | Motion | Text / VO | Sound |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0–1.5 s | | | | |
| 2 | | | | | |
| 3 | | | | | |

## 4. Storyboard

- One frame per beat, rendered as a quick PNG (rough shapes are fine) and assembled into a contact sheet (`skills/render-and-deliver.md`).
- Name frames per `templates/file-naming.md`, type `sb`.

## 5. Style frame

One polished still that sets the look:

- Palette (3–5 colours with hex), checked for WCAG AA contrast on any text.
- Type: one or two typefaces with licence noted; minimum on-screen text size about 4% of frame height.
- Motion language: easing family, tempo (BPM if music), how things enter and exit.
- Reduced-motion plan: what the still or low-motion fallback looks like.

## 6. Check in

Send the story line, beat table, contact sheet and style frame together. Pieces of 15 s or less can skip straight to a preview render.
