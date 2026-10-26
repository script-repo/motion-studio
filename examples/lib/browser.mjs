import { chromium } from 'playwright-core';
// Set CHROME_PATH to use a specific Chromium build; otherwise Playwright's installed Chromium is used
// (install once with: npx playwright-core install chromium).
export const CHROME = process.env.CHROME_PATH || undefined;
export async function launch() {
  return chromium.launch({
    executablePath: CHROME,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required',
      '--font-render-hinting=none', ...(process.env.GPU2D ? [] : ['--disable-accelerated-2d-canvas'])],
  });
}
