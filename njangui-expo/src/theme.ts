/**
 * Jetons de design de Njangui.
 *
 * Chaque écran ne lit que des couleurs sémantiques (`background`, `card`,
 * `text`, `purple`…). Les palettes `light` et `dark` fournissent la même
 * liste de clés : basculer de thème ne demande donc aucune condition dans
 * les styles.
 *
 * Règle de couleur : les surfaces restent neutres, les accents servent à
 * signaler (statut, action, montant) et couvrent moins d'un dixième de
 * l'écran. Les contrastes de corps de texte visent 4,5–7:1, pas le maximum.
 */
export type Palette = {
  /** Fond principal des écrans. */
  background: string;
  /** Fond légèrement contrasté (sections, en-têtes). */
  backgroundAlt: string;
  /** Fond des cartes et feuilles. */
  card: string;
  /** Fond des champs et blocs discrets. */
  cardMuted: string;

  text: string;
  textMuted: string;
  textFaint: string;

  border: string;
  borderStrong: string;

  purple: string;
  purpleSolid: string;
  purpleSoft: string;

  mint: string;
  mintSoft: string;
  onMint: string;

  green: string;
  greenSolid: string;
  greenSoft: string;

  teal: string;
  tealSoft: string;

  red: string;
  redDark: string;
  redSoft: string;

  blue: string;
  blueSoft: string;

  /** Texte/icônes posés sur une surface pleine (purple, green, red…). */
  onAccent: string;
  toast: string;
  scrim: string;
  shadow: string;

  /** Halos décoratifs de la couverture. */
  decorA: string;
  decorB: string;
};

export const light: Palette = {
  background: '#FFFFFF',
  backgroundAlt: '#F6F8F7',
  card: '#FFFFFF',
  cardMuted: '#F2F5F4',

  text: '#101614',
  textMuted: '#4A5451',
  textFaint: '#6B7570',

  border: '#E4E9E7',
  borderStrong: '#C7CFCB',

  purple: '#6E2B7C',
  purpleSolid: '#6E2B7C',
  purpleSoft: 'rgba(110,43,124,0.08)',

  mint: '#8FE6CA',
  mintSoft: '#EAF7F2',
  onMint: '#10211C',

  green: '#2E8F68',
  greenSolid: '#2E8F68',
  greenSoft: '#E7F4EE',

  teal: '#2A8390',
  tealSoft: 'rgba(42,131,144,0.10)',

  red: '#C4453C',
  redDark: '#A8372F',
  redSoft: '#FBEDEC',

  blue: '#2F6FB8',
  blueSoft: 'rgba(47,111,184,0.10)',

  onAccent: '#FFFFFF',
  toast: '#232B29',
  scrim: 'rgba(9,14,12,0.45)',
  shadow: '#0F211B',

  decorA: 'rgba(110,43,124,0.06)',
  decorB: 'rgba(46,143,104,0.07)',
};

export const dark: Palette = {
  background: '#0F1412',
  backgroundAlt: '#141B18',
  card: '#161C1A',
  cardMuted: '#1B2320',

  text: '#E8EEEB',
  textMuted: '#9AA69F',
  textFaint: '#7A857F',

  border: '#26302C',
  borderStrong: '#35423C',

  purple: '#C9A2D9',
  purpleSolid: '#7B3A8B',
  purpleSoft: 'rgba(201,162,217,0.14)',

  mint: '#6FD3B3',
  mintSoft: 'rgba(111,211,179,0.12)',
  onMint: '#0B1A15',

  green: '#57BE92',
  greenSolid: '#2E8F68',
  greenSoft: 'rgba(87,190,146,0.13)',

  teal: '#6EC5D2',
  tealSoft: 'rgba(110,197,210,0.14)',

  red: '#E5807A',
  redDark: '#C4625C',
  redSoft: 'rgba(229,128,122,0.14)',

  blue: '#7FB4E8',
  blueSoft: 'rgba(127,180,232,0.14)',

  onAccent: '#FFFFFF',
  toast: '#1E2724',
  scrim: 'rgba(0,0,0,0.6)',
  shadow: '#000000',

  decorA: 'rgba(201,162,217,0.08)',
  decorB: 'rgba(111,211,179,0.06)',
};

/** Raccourci historique (thème clair) — conservé pour les rares usages figés. */
export const colors = light;

export const radius = {
  card: 16,
  field: 12,
  pill: 22,
};

export const screenPadding = 20;
