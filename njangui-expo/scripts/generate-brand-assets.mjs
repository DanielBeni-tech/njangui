/**
 * Génère la marque Njangui d'après le guide fourni dans « UIUX & appflow ».
 *
 * Le symbole : des personnes en cercle, bras tendus vers l'espace central,
 * dans un mouvement de tourbillon — solidarité, communauté, épargne
 * collective. Le centre reste creux, comme la main commune de la tontine.
 *
 * Usage : node scripts/generate-brand-assets.mjs
 * Sorties : assets/brand/*.svg, assets/brand/logo-*.png + icônes d'app.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRAND = path.join(ROOT, 'assets', 'brand');
const ASSETS = path.join(ROOT, 'assets');

/** Palette officielle du symbole, dans le sens horaire. */
const TONES = ['#6C2BD9', '#2F6BD8', '#12A9C6', '#4CAF50', '#8CC63F', '#F5A623', '#E6186C'];
const NAVY = '#101747';
const PURPLE = '#71358A';
const MUTED = '#777783';
const WHITE = '#FFFFFF';

const N = 10; // personnes
const R_OUT = 15;
const R_IN = 5.5;
const HEAD_R = 3.0;

const rad = (deg) => ((deg - 90) * Math.PI) / 180;
const pt = (r, deg) => [
  32 + r * Math.cos(rad(deg)),
  32 + r * Math.sin(rad(deg)),
];
const f = (n) => n.toFixed(2);

/** Bras/épaules : bande courbe qui part de l'extérieur et se recourbe au centre. */
function armPath() {
  const [x0, y0] = pt(R_OUT, -18);
  const [x1, y1] = pt(R_OUT, 2);
  const [c1x, c1y] = pt(9.5, 16);
  const [x2, y2] = pt(R_IN, 38);
  const [x3, y3] = pt(R_IN, 14);
  const [c2x, c2y] = pt(11.5, -8);
  return (
    `M ${f(x0)} ${f(y0)} A ${R_OUT} ${R_OUT} 0 0 1 ${f(x1)} ${f(y1)} ` +
    `Q ${f(c1x)} ${f(c1y)} ${f(x2)} ${f(y2)} A ${R_IN} ${R_IN} 0 0 0 ${f(x3)} ${f(y3)} ` +
    `Q ${f(c2x)} ${f(c2y)} ${f(x0)} ${f(y0)} Z`
  );
}

const [headX, headY] = pt(16.8, -9);

/**
 * Symbole complet. `tones` : couleurs tournantes ; `mono` : une seule teinte.
 */
function symbol({ tones = TONES, mono = null, outline = null, count = N } = {}) {
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const angle = (360 / count) * i;
    const color = mono ?? tones[i % tones.length];
    if (outline) {
      out +=
        `<g transform="rotate(${angle} 32 32)" fill="none" stroke="${outline}" stroke-width="1.6" stroke-linejoin="round">` +
        `<path d="${armPath()}"/>` +
        `<circle cx="${f(headX)}" cy="${f(headY)}" r="${HEAD_R}"/>` +
        `</g>`;
    } else {
      out +=
        `<g transform="rotate(${angle} 32 32)" fill="${color}">` +
        `<path d="${armPath()}"/>` +
        `<circle cx="${f(headX)}" cy="${f(headY)}" r="${HEAD_R}"/>` +
        `</g>`;
    }
  }
  return out;
}

const svg = (attrs, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} fill="none">${inner}</svg>\n`;

const square = (inner, size = 64) =>
  svg(`width="${size}" height="${size}" viewBox="0 0 64 64"`, `<g>${inner}</g>`);

const scaleWrap = (inner, scale, size) =>
  svg(
    `width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"`,
    `<g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(-32 -32)">${inner}</g>`,
  );

/** Symbole + nom + signature, empilés (logo principal). */
const primary = (tones, nameColor, tagColor) =>
  svg(
    'width="260" height="150" viewBox="0 0 260 150"',
    `<g transform="translate(66 14) scale(2) translate(-32 -32)">${symbol({ tones })}</g>` +
      `<text x="130" y="112" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="700" fill="${nameColor}">Njangui</text>` +
      `<text x="130" y="136" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="12" fill="${tagColor}">La tontine, sans conflit</text>`,
  );

/** Symbole + nom sur une ligne. */
const horizontal = (tones, nameColor, tagColor) =>
  svg(
    'width="300" height="84" viewBox="0 0 300 84"',
    `<g transform="translate(34 42) scale(1.15) translate(-32 -32)">${symbol({ tones })}</g>` +
      `<text x="78" y="44" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="30" font-weight="700" fill="${nameColor}">Njangui</text>` +
      `<text x="80" y="62" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="11" fill="${tagColor}">La tontine, sans conflit</text>`,
  );

const appIcon = () =>
  svg(
    'width="1024" height="1024" viewBox="0 0 1024 1024"',
    `<rect width="1024" height="1024" rx="232" fill="${NAVY}"/>` +
      `<g transform="translate(512 512) scale(10.4) translate(-32 -32)">${symbol()}</g>`,
  );

const gradientLogo = () =>
  svg(
    'width="420" height="140" viewBox="0 0 420 140"',
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#2F6BD8"/><stop offset="0.55" stop-color="#6C2BD9"/><stop offset="1" stop-color="#E6186C"/>` +
      `</linearGradient></defs>` +
      `<rect width="420" height="140" rx="20" fill="url(#g)"/>` +
      `<g transform="translate(82 70) scale(1.5) translate(-32 -32)">${symbol()}</g>` +
      `<text x="150" y="68" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="36" font-weight="700" fill="${WHITE}">Njangui</text>` +
      `<text x="152" y="90" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.82)">La tontine, sans conflit</text>`,
  );

const badge = () =>
  svg(
    'width="120" height="120" viewBox="0 0 120 120"',
    `<circle cx="60" cy="60" r="58" fill="${WHITE}" stroke="${NAVY}" stroke-width="2"/>` +
      `<g transform="translate(60 60) scale(1.55) translate(-32 -32)">${symbol()}</g>`,
  );

const faviconSvg = () =>
  svg(
    'width="64" height="64" viewBox="0 0 64 64"',
    `<style>
      .plate { fill: ${WHITE}; }
      @media (prefers-color-scheme: dark) { .plate { fill: ${NAVY}; } }
    </style>` +
      `<rect class="plate" width="64" height="64" rx="14"/>` +
      `<g transform="translate(32 32) scale(0.86) translate(-32 -32)">${symbol({ count: 8 })}</g>`,
  );

await mkdir(BRAND, { recursive: true });

const files = {
  'logo-primary.svg': primary(TONES, NAVY, MUTED),
  'logo-primary-dark.svg': primary(TONES, WHITE, 'rgba(255,255,255,0.72)'),
  'logo-symbol.svg': square(symbol()),
  'logo-symbol-simplified.svg': square(symbol({ count: 8 })),
  'logo-horizontal.svg': horizontal(TONES, NAVY, MUTED),
  'logo-horizontal-dark.svg': horizontal(TONES, WHITE, 'rgba(255,255,255,0.72)'),
  'logo-wordmark.svg': svg(
    'width="240" height="90" viewBox="0 0 240 90"',
    `<text x="120" y="46" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="700" fill="${NAVY}">Njangui</text>` +
      `<text x="120" y="68" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="11" fill="${MUTED}">La tontine, sans conflit</text>`,
  ),
  'logo-mono-dark.svg': square(symbol({ mono: NAVY })),
  'logo-mono-white.svg': square(symbol({ mono: WHITE })),
  'logo-outline.svg': square(symbol({ outline: NAVY })),
  'logo-badge.svg': badge(),
  'logo-gradient.svg': gradientLogo(),
  'app-icon.svg': appIcon(),
  'app-icon-adaptive-foreground.svg': scaleWrap(symbol(), 9.4, 1024),
  'app-icon-monochrome.svg': scaleWrap(symbol({ mono: '#000000' }), 9.4, 1024),
  'splash-icon.svg': scaleWrap(symbol(), 5.6, 512),
  'splash-icon-dark.svg': scaleWrap(symbol(), 5.6, 512),
  'favicon.svg': faviconSvg(),
};

for (const [name, content] of Object.entries(files)) {
  await writeFile(path.join(BRAND, name), content);
}

// Anciens fichiers de la version précédente, retirés au profit des nouveaux noms.
import { rm } from 'node:fs/promises';
for (const vieux of [
  'logo-mark.svg',
  'logo-mark-dark.svg',
  'logo-mark-compact.svg',
  'logo-mark-mono.svg',
  'logo-wordmark-dark.svg',
]) {
  await rm(path.join(BRAND, vieux), { force: true });
}

const png = async (svgText, size, target) =>
  sharp(Buffer.from(svgText)).resize(size, size).png().toFile(target);

await png(files['app-icon.svg'], 1024, path.join(ASSETS, 'icon.png'));
await png(files['app-icon.svg'], 512, path.join(BRAND, 'app-icon-512.png'));
await png(files['app-icon.svg'], 192, path.join(BRAND, 'app-icon-192.png'));
await png(files['app-icon.svg'], 180, path.join(ASSETS, 'apple-touch-icon.png'));
await png(
  files['app-icon-adaptive-foreground.svg'],
  1024,
  path.join(ASSETS, 'android-icon-foreground.png'),
);
await png(
  files['app-icon-monochrome.svg'],
  1024,
  path.join(ASSETS, 'android-icon-monochrome.png'),
);
await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 16, g: 23, b: 71, alpha: 1 },
  },
})
  .png()
  .toFile(path.join(ASSETS, 'android-icon-background.png'));
await png(files['splash-icon.svg'], 512, path.join(ASSETS, 'splash-icon.png'));
await png(files['splash-icon-dark.svg'], 512, path.join(ASSETS, 'splash-icon-dark.png'));

for (const size of [16, 32, 48, 64]) {
  await png(files['favicon.svg'], size, path.join(BRAND, `favicon-${size}.png`));
}
await png(files['favicon.svg'], 32, path.join(ASSETS, 'favicon.png'));

console.log('Marque Njangui générée (guide UIUX) :', BRAND);
