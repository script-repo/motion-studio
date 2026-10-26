// Render a single still from a page: node still.mjs --html=x --out=x.png --w= --h= [--t=seconds] [--dpr=]
import { launch } from './browser.mjs';
import path from 'path';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: +args.w, height: +args.h }, deviceScaleFactor: +(args.dpr || 1) });
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto('file://' + path.resolve(args.html) + (args.query || ''));
for (let k = 0; k < 600 && !(await page.evaluate(() => !!window.__ready)); k++) await new Promise(r => setTimeout(r, 100));
if (args.t !== undefined) await page.evaluate(t => window.renderFrame && window.renderFrame(+t), args.t);
if (args.canvas) { const d = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png')); (await import('fs')).writeFileSync(args.out, Buffer.from(d.split(',')[1], 'base64')); }
else await page.screenshot({ path: args.out, type: 'png' });
await browser.close();
console.log('saved', args.out);
