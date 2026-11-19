/**
 * Jetons de design Njangui — alignés sur le design system du guide UIUX.
 *
 * Chaque écran ne lit que des couleurs sémantiques (`background`, `card`,
 * `text`, `purple`…). Les palettes `light` et `dark` fournissent la même
 * liste de clés : basculer de thème ne demande donc aucune condition dans
 * les styles.
 *
 * Règle de couleur : les surfaces restent neutres, les accents servent à
 * signaler (statut, action, montant) et couvrent moins d'un dixième de
 * l'écran.
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
  purpleSecondary: string;

  /** Surface « premium » de la carte d'accueil et des en-têtes. */
  navy: string;

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

  warning: string;
  warningSoft: string;

  /** Texte/icônes posés sur une surface pleine (purple, navy, red…). */
  onAccent: string;
  toast: string;
  scrim: string;
  shadow: string;

  /** Halos décoratifs de la couverture. */
  decorA: string;
  decorB: string;
};

export const light: Palette = {
  background: '#F8F7FC',
  backgroundAlt: '#F1EFF8',
  card: '#FFFFFF',
  cardMuted: '#F3F1F9',

  text: '#202033',
  textMuted: '#777783',
  textFaint: '#9A98AA',

  border: '#E9E5EF',
  borderStrong: '#D6D1E0',

  purple: '#71358A',
  purpleSolid: '#71358A',
  purpleSoft: 'rgba(113,53,138,0.09)',
  purpleSecondary: '#963BB5',

  navy: '#101747',

  mint: '#90EED4',
  mintSoft: '#E7FBF6',
  onMint: '#0B2019',

  green: '#2E9E6E',
  greenSolid: '#2E9E6E',
  greenSoft: '#E6F6EF',

  teal: '#1F8FA6',
  tealSoft: 'rgba(31,143,166,0.10)',

  red: '#D94B58',
  redDark: '#BC3A47',
  redSoft: '#FCEDEF',

  blue: '#3978D5',
  blueSoft: 'rgba(57,120,213,0.10)',

  warning: '#E6A23C',
  warningSoft: 'rgba(230,162,60,0.14)',

  onAccent: '#FFFFFF',
  toast: '#1E1F2C',
  scrim: 'rgba(16,23,71,0.45)',
  shadow: '#101747',

  decorA: 'rgba(113,53,138,0.07)',
  decorB: 'rgba(144,238,212,0.18)',
};

export const dark: Palette = {
  background: '#10121B',
  backgroundAlt: '#151827',
  card: '#191B27',
  cardMuted: '#212432',

  text: '#F4F4F8',
  textMuted: '#A5A6B4',
  textFaint: '#7E7F90',

  border: '#292B35',
  borderStrong: '#3A3C49',

  purple: '#963BB5',
  purpleSolid: '#8A38A8',
  purpleSoft: 'rgba(150,59,181,0.18)',
  purpleSecondary: '#B15FD0',

  navy: '#181C33',

  mint: '#90EED4',
  mintSoft: 'rgba(144,238,212,0.12)',
  onMint: '#0B2019',

  green: '#4CB88A',
  greenSolid: '#2E9E6E',
  greenSoft: 'rgba(76,184,138,0.14)',

  teal: '#6FC7DA',
  tealSoft: 'rgba(111,199,218,0.14)',

  red: '#E8737C',
  redDark: '#D94B58',
  redSoft: 'rgba(232,115,124,0.15)',

  blue: '#7FA8E8',
  blueSoft: 'rgba(127,168,232,0.15)',

  warning: '#E6A23C',
  warningSoft: 'rgba(230,162,60,0.16)',

  onAccent: '#FFFFFF',
  toast: '#232637',
  scrim: 'rgba(0,0,0,0.62)',
  shadow: '#000000',

  decorA: 'rgba(150,59,181,0.12)',
  decorB: 'rgba(144,238,212,0.07)',
};

/** Raccourci historique (thème clair) — conservé pour les rares usages figés. */
export const colors = light;

/** Échelle de rayons du design system. */
export const radius = {
  small: 8,
  field: 12,
  button: 16,
  card: 18,
  container: 24,
  pill: 999,
};

/** Système d'espacement 8 points. */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Échelle typographique du guide. */
export const type = {
  display: 32,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  label: 12,
};

export const screenPadding = 20;
