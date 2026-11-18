/**
 * Vérification du numéro de téléphone.
 *
 * L'application Flutter utilisait Firebase Phone Auth (`verifyPhoneNumber`).
 * Le SDK JavaScript de Firebase ne sait pas faire d'authentification par SMS
 * dans React Native (il lui faut un reCAPTCHA dans le DOM), et
 * `@react-native-firebase/auth` exige un development build natif.
 *
 * En attendant ce choix d'architecture, ce module simule le même parcours :
 * un code à 6 chiffres est généré, affiché sur l'écran de saisie, et validé.
 *
 * Pour brancher le vrai service : remplacer ces deux fonctions par
 * `signInWithPhoneNumber` de `@react-native-firebase/auth` (development build)
 * ou par une API de votre backend. Le reste des écrans reste inchangé.
 */

type VerificationEnCours = {
  phoneNumber: string;
  code: string;
  expiresAt: number;
};

const DUREE_VALIDITE_MS = 5 * 60 * 1000;

let verification: VerificationEnCours | null = null;

const attendre = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function sendVerificationCode(
  phoneNumber: string,
): Promise<{ verificationId: string; devCode: string }> {
  await attendre(800);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  verification = {
    phoneNumber,
    code,
    expiresAt: Date.now() + DUREE_VALIDITE_MS,
  };
  if (__DEV__) {
    console.log(`[auth] code de vérification pour ${phoneNumber} : ${code}`);
  }
  return { verificationId: `verif-${Date.now()}`, devCode: code };
}

export async function confirmVerificationCode(
  _verificationId: string,
  code: string,
): Promise<void> {
  await attendre(600);
  if (!verification) {
    throw new Error('Aucune vérification en cours. Renvoyez le code.');
  }
  if (Date.now() > verification.expiresAt) {
    verification = null;
    throw new Error('Le code a expiré. Renvoyez le code.');
  }
  if (verification.code !== code.trim()) {
    throw new Error('Code incorrect.');
  }
  verification = null;
}

/** Numéro au format E.164 camerounais, comme dans l'écran de connexion Flutter. */
export function formatPhoneNumber(saisie: string): string {
  const valeur = saisie.trim();
  if (valeur.startsWith('+')) return valeur;
  const chiffres = valeur.replace(/[^0-9]/g, '');
  return `+237${chiffres}`;
}
