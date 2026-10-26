// Build the single self-contained HTML file: inline the esbuild bundle and base64 woff2 fonts.
import fs from 'fs';
const f = (n, w, file) => `@font-face{font-family:'${n}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync('../node_modules/@fontsource/' + file).toString('base64')}) format('woff2')}`;
const fonts = [f('Space Grotesk', 700, 'space-grotesk/files/space-grotesk-latin-700-normal.woff2'), f('JetBrains Mono', 500, 'jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2')].join('\n');
let html = fs.readFileSync('index.html', 'utf8').replace('/*FONTS*/', fonts);
html = html.replace('<script>/*BUNDLE*/</script>', () => '<script>' + fs.readFileSync('bundle.js', 'utf8').replace(/<\/script/g, '<\\/script') + '</script>');
fs.writeFileSync('05-interactive-toy.html', html); console.log('wrote 05-interactive-toy.html', (html.length / 1024).toFixed(0), 'KB');
