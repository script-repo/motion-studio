// Block-letter geometry as compound rectangles [cx, cy, w, h, angle] (metres, letter-local, y down)
export const HH = 2.6, T = 0.56;
function bar(x1, y1, x2, y2, t = T) { const L = Math.hypot(x2 - x1, y2 - y1) + t * 0.5; return [(x1 + x2) / 2, (y1 + y2) / 2, L, t, Math.atan2(y2 - y1, x2 - x1)]; }
const top = -HH / 2, bot = HH / 2;
export const GLYPHS = {
  M: { w: 2.5, rects: [[-1.25 + T / 2, 0, T, HH, 0], [1.25 - T / 2, 0, T, HH, 0], bar(-1.25 + T / 2, top + T / 2, 0, 0.35), bar(1.25 - T / 2, top + T / 2, 0, 0.35)] },
  O: { w: 2.1, rects: [[-1.05 + T / 2, 0, T, HH, 0], [1.05 - T / 2, 0, T, HH, 0], [0, top + T / 2, 2.1, T, 0], [0, bot - T / 2, 2.1, T, 0]] },
  T: { w: 2.1, rects: [[0, top + T / 2, 2.1, T, 0], [0, T / 2, T, HH - T, 0]] },
  I: { w: T, rects: [[0, 0, T, HH, 0]] },
  N: { w: 2.1, rects: [[-1.05 + T / 2, 0, T, HH, 0], [1.05 - T / 2, 0, T, HH, 0], bar(-1.05 + T / 2, top + T / 2, 1.05 - T / 2, bot - T / 2)] },
};
