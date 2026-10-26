// Motion Studio shared palette
export const P = { ink: '#0B1020', ink2: '#141B33', cream: '#F4EFE6', coral: '#FF6B5B', amber: '#FFC857', teal: '#2EC4B6', violet: '#7B61FF', sky: '#6EC1FF', mist: '#9AA3C7' };
export async function loadFonts(list = ['400 20px Inter', '700 20px Inter', '800 20px Inter', '500 20px "Space Grotesk"', '700 20px "Space Grotesk"', '400 20px "JetBrains Mono"']) {
  await Promise.all(list.map(f => document.fonts.load(f))); await document.fonts.ready;
}
