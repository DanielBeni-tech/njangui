/**
 * Génère la marque Njangui (masters SVG) puis les rasters (PNG, favicons).
 *
 * Le dessin : huit silhouettes en cercle, têtes tournées vers l'extérieur,
 * épaules jointes autour d'un espace vide — le pot commun. Le centre reste
 * ouvert : c'est l'espace que la communauté entoure.
 *
 * Usage : node scripts/generate-brand-assets.mjs
 * Sorties : assets/brand/*.svg + assets/icon*.png, favicon*, splash-icon*.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRAND = path.join(ROOT, 'assets', 'brand');
const ASSETS = path.join(ROOT, 'assets');

const LIGHT = ['#6E2B7C', '#2A8390', '#2E8F68', '#B8862E'];
const DARK = ['#C9A2D9', '#6EC5D2', '#5FCB9B', '#E0AE5C'];
const INK = '#101614';
const PAPER = '#F3F7F5';

const rad = (deg) => (deg * Math.PI) / 180;

/** Corps (épaules) d'une personne, dans son repère local : +y = vers l'extérieur. */
function body(width) {
  const w = width / 2;
  return `M ${-w * 0.61} -2.5 L ${w * 0.61} -2.5 Q ${w} -2.5 ${w} 0.2 L ${w} 2.3 L ${-w} 2.3 L ${-w} 0.2 Q ${-w} -2.5 ${-w * 0.61} -2.5 Z`;
}

/**
 * Marque dans un repère 64×64.
 * `colors` : 4 teintes alternées ; `mono` remplace la palette par une couleur.
 */
function markBody(colors, { count = 8, radius = 15, width = 10.4, head = 3.25, mono = null } = {}) {
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const theta = (360 / count) * i - 90;
    const cx = 32 + radius * Math.cos(rad(theta));
    const cy = 32 + radius * Math.sin(rad(theta));
    const color = mono ?? colors[i % colors.length];
    out +=
      `<g transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${(theta - 90).toFixed(1)})" fill="${color}">` +
      `<path class="body" d="${body(width)}"/>` +
      `<circle class="head" cy="4.6" r="${head}"/>` +
      `</g>`;
  }
  return out;
}

const MONO = { count: 8, radius: 15, width: 10.8, head: 3.3, mono: 'currentColor' };
const COMPACT = { count: 6, radius: 14.4, width: 13, head: 4.1 };

const svg = (attrs, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} fill="none">${inner}</svg>\n`;

const square = (inner) =>
  svg('width="64" height="64" viewBox="0 0 64 64"', `<g>${inner}</g>`);

const wordmark = (colors, textColor) =>
  svg(
    'width="260" height="64" viewBox="0 0 260 64"',
    markBody(colors) +
      `<text x="80" y="41" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="27" font-weight="600" letter-spacing="4.1" fill="${textColor}">NJANGUI</text>`,
  );

const appIcon = (inner) =>
  svg(
    'width="1024" height="1024" viewBox="0 0 1024 1024"',
    `<rect width="1024" height="1024" rx="232" fill="${PAPER}"/>` +
      `<g transform="translate(512 512) scale(9.9) translate(-32 -32)">${inner}</g>`,
  );

const transparentIcon = (inner, scale) =>
  svg(
    'width="1024" height="1024" viewBox="0 0 1024 1024"',
    `<g transform="translate(512 512) scale(${scale}) translate(-32 -32)">${inner}</g>`,
  );

/** Favicon : deux variantes pilotées par `prefers-color-scheme`. */
function faviconSvg() {
  const classes = ['a', 'b', 'c', 'd'];
  let figures = '';
  for (let i = 0; i < 8; i += 1) {
    const theta = 45 * i - 90;
    const cx = 32 + 14.6 * Math.cos(rad(theta));
    const cy = 32 + 14.6 * Math.sin(rad(theta));
    const cls = classes[i % classes.length];
    figures +=
      `<g class="${cls}" transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${(theta - 90).toFixed(1)})">` +
      `<path d="${body(10)}"/><circle cy="4.6" r="3.2"/></g>`;
  }
  return svg(
    'width="64" height="64" viewBox="0 0 64 64"',
    `<style>
      .plate { fill: ${PAPER}; }
      .a { fill: ${LIGHT[0]}; }
      .b { fill: ${LIGHT[1]}; }
      .c { fill: ${LIGHT[2]}; }
      .d { fill: ${LIGHT[3]}; }
      @media (prefers-color-scheme: dark) {
        .plate { fill: #0F1412; }
        .a { fill: ${DARK[0]}; }
        .b { fill: ${DARK[1]}; }
        .c { fill: ${DARK[2]}; }
        .d { fill: ${DARK[3]}; }
      }
    </style><rect class="plate" width="64" height="64" rx="14"/>${figures}`,
  );
}

await mkdir(BRAND, { recursive: true });

const files = {
  'logo-mark.svg': square(markBody(LIGHT)),
  'logo-mark-dark.svg': square(markBody(DARK)),
  'logo-mark-compact.svg': square(markBody(LIGHT, COMPACT)),
  'logo-mark-mono.svg': square(markBody(LIGHT, MONO)),
  'logo-wordmark.svg': wordmark(LIGHT, INK),
  'logo-wordmark-dark.svg': wordmark(DARK, '#E8EEEB'),
  'app-icon.svg': appIcon(markBody(LIGHT)),
  'app-icon-adaptive-foreground.svg': transparentIcon(markBody(LIGHT), 8.4),
  'app-icon-monochrome.svg': transparentIcon(
    markBody(LIGHT, { ...MONO, mono: '#000000' }),
    8.4,
  ),
  'splash-icon.svg': svg(
    'width="512" height="512" viewBox="0 0 512 512"',
    `<g transform="translate(256 256) scale(5.4) translate(-32 -32)">${markBody(LIGHT)}</g>`,
  ),
  'splash-icon-dark.svg': svg(
    'width="512" height="512" viewBox="0 0 512 512"',
    `<g transform="translate(256 256) scale(5.4) translate(-32 -32)">${markBody(DARK)}</g>`,
  ),
  'favicon.svg': faviconSvg(),
};

for (const [name, content] of Object.entries(files)) {
  await writeFile(path.join(BRAND, name), content);
}

const png = async (svgText, size, target) =>
  sharp(Buffer.from(svgText)).resize(size, size).png().toFile(target);

await png(files['app-icon.svg'], 1024, path.join(ASSETS, 'icon.png'));
await png(files['app-icon.svg'], 512, path.join(BRAND, 'icon-512.png'));
await png(files['app-icon.svg'], 192, path.join(BRAND, 'icon-192.png'));
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
    background: { r: 243, g: 247, b: 245, alpha: 1 },
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

console.log('Marque générée dans assets/brand/ + assets/*.png');
