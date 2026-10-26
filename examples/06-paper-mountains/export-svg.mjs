// Export the final frame of 06 as SVG (Paper.js exportSVG) — run from this folder.
import { launch } from '../lib/browser.mjs';
import fs from 'fs'; import path from 'path';
// embed the two typefaces so the SVG renders identically anywhere
const ff = (fam, w, file) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync('../node_modules/@fontsource/' + file).toString('base64')}) format('woff2')}`;
const FONTS = ff('Space Grotesk', 700, 'space-grotesk/files/space-grotesk-latin-700-normal.woff2') + ff('JetBrains Mono', 400, 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2');
const b = await launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
await p.goto('file://' + path.resolve('index.html'));
for (let k = 0; k < 300 && !(await p.evaluate(() => !!window.__ready)); k++) await new Promise(r => setTimeout(r, 100));
const svg = await p.evaluate(() => window.exportSVG());
fs.writeFileSync('06-paper-mountains-final.svg', svg.replace(/(<svg[^>]*>)/, (m) => m + '<defs><style>' + FONTS + '</style></defs><rect width="1080" height="1080" fill="#F4EFE6"/>'));
await b.close(); console.log('svg', svg.length);
