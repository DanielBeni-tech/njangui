/**
 * Jetons de design de Njangi.
 *
 * Chaque écran ne lit que des couleurs sémantiques (`background`, `card`,
 * `text`, `purple`…). Les palettes `light` et `dark` fournissent la même
 * liste de clés : basculer de thème ne demande donc aucune condition dans
 * les styles.
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

  /** Halos décoratifs de l'écran de connexion. */
  decorA: string;
  decorB: string;
};

export const light: Palette = {
  background: '#FFFFFF',
  backgroundAlt: '#F7FBFA',
  card: '#FFFFFF',
  cardMuted: '#F3F6F5',

  text: '#131A17',
  textMuted: '#4B5563',
  textFaint: '#8A9298',

  border: '#E3E8E6',
  borderStrong: '#C4CCC8',

  purple: '#7B2D8B',
  purpleSolid: '#7B2D8B',
  purpleSoft: 'rgba(123,45,139,0.08)',

  mint: '#90EED4',
  mintSoft: '#ECFAF5',
  onMint: '#0F211B',

  green: '#2E9E6E',
  greenSolid: '#2E9E6E',
  greenSoft: '#E8F7F0',

  teal: '#2E8B9A',
  tealSoft: 'rgba(46,139,154,0.10)',

  red: '#F44336',
  redDark: '#C62828',
  redSoft: '#FFEBEE',

  blue: '#2196F3',
  blueSoft: 'rgba(33,150,243,0.10)',

  onAccent: '#FFFFFF',
  toast: '#2B3230',
  scrim: 'rgba(9,14,12,0.45)',
  shadow: '#0F211B',

  decorA: 'rgba(123,45,139,0.07)',
  decorB: 'rgba(144,238,212,0.22)',
};

export const dark: Palette = {
  background: '#0D1211',
  backgroundAlt: '#121917',
  card: '#161E1C',
  cardMuted: '#1C2523',

  text: '#F1F6F4',
  textMuted: '#A7B3AF',
  textFaint: '#7C8783',

  border: '#25302D',
  borderStrong: '#38453F',

  purple: '#C98AD7',
  purpleSolid: '#7B2D8B',
  purpleSoft: 'rgba(201,138,215,0.16)',

  mint: '#7FE3C6',
  mintSoft: 'rgba(127,227,198,0.13)',
  onMint: '#0B1A15',

  green: '#5FCB9B',
  greenSolid: '#2E9E6E',
  greenSoft: 'rgba(95,203,155,0.14)',

  teal: '#6EC5D2',
  tealSoft: 'rgba(110,197,210,0.16)',

  red: '#FF7B72',
  redDark: '#FF8A80',
  redSoft: 'rgba(255,123,114,0.16)',

  blue: '#74BAFF',
  blueSoft: 'rgba(116,186,255,0.16)',

  onAccent: '#FFFFFF',
  toast: '#24302C',
  scrim: 'rgba(0,0,0,0.62)',
  shadow: '#000000',

  decorA: 'rgba(201,138,215,0.10)',
  decorB: 'rgba(127,227,198,0.07)',
};

/** Raccourci historique (thème clair) — conservé pour les rares usages figés. */
export const colors = light;

export const radius = {
  card: 16,
  field: 12,
  pill: 30,
};

export const screenPadding = 20;
