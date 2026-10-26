# File naming

A lightweight convention in the spirit of the Holli-Tech/agent-skills `vfx-file-naming` skill (itself based on the ETC@USC / MovieLabs VFX image-sequence naming spec), trimmed for motion-design work.

## Grammar

```
<show>_<seq>_<shot>_<type>_v<rev>{_<desc>}{.<frame>}.<ext>
```

| Token | Format | Example | Meaning |
| --- | --- | --- | --- |
| `show` | 3–8 lowercase alphanumerics | `qsig` | Project or piece |
| `seq` | 2–4 alphanumerics | `intro` | Section or sequence |
| `shot` | 4 digits | `0010` | Shot or beat; `0000` when it applies to the whole piece |
| `type` | code from the table below | `comp` | What the file is |
| `v<rev>` | `v` + 3 digits | `v003` | Bump on every iteration you share |
| `desc` | lowercase, `-` between words | `9x16-captioned` | Optional extra context |
| `frame` | 4+ digits, after a dot | `.0001` | Image sequences only |

Rules: underscores between tokens, dots only before the frame and the extension, no spaces, lowercase, never overwrite a shared version.

## Type codes

| Code | Use |
| --- | --- |
| `brief` | Brief and notes |
| `sb` | Storyboard frames and boards |
| `sf` | Style frame |
| `prev` | Preview render |
| `comp` | Final composition render |
| `vo` | Voiceover audio |
| `mus` | Music bed |
| `sfx` | Sound effects |
| `cap` | Captions (`.srt`, `.vtt`) |
| `still` | Delivery still |
| `cs` | Contact sheet |
| `web` | Interactive HTML |
| `credits` | Credits and licences |

## Examples

```
qsig_intro_0000_brief_v001.md
qsig_intro_0010_sb_v002.png
qsig_intro_0000_sf_v001.png
qsig_intro_0000_prev_v004_half-res.mp4
qsig_intro_0000_comp_v007_9x16-captioned.mp4
qsig_intro_0000_cap_v007.srt
qsig_intro_0000_cs_v007.png
qsig_flow_0000_web_v002_reduced-motion.html
qsig_intro_0000_comp_v007.0001.png
```

## Folders

```
projects/<show>/
  brief/  board/  src/  audio/  renders/prev/  renders/final/  deliver/  credits.md
```
