/**
 * Notifications locales (aucun serveur push nécessaire).
 *
 * Les actions de la démo (tontine créée, membre ajouté, dépôt, retard) sont
 * déclenchées dans l'application : elles produisent donc une vraie
 * notification système sur le téléphone — bannière + centre de notifications.
 *
 * `expo-notifications` n'existe pas sur le web : le module est chargé
 * paresseusement et jamais sur `Platform.OS === 'web'`.
 */
import { Platform } from 'react-native';

type NotificationsApi = typeof import('expo-notifications');

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unsupported';

const CANAL = 'default';
let api: NotificationsApi | null | undefined;

function getApi(): NotificationsApi | null {
  if (Platform.OS === 'web') return null;
  if (api !== undefined) return api;
  try {
    const module = require('expo-notifications') as NotificationsApi;
    module.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    api = module;
  } catch (erreur) {
    console.warn('[notifications] module indisponible', erreur);
    api = null;
  }
  return api;
}

async function creerCanal(n: NotificationsApi) {
  if (Platform.OS !== 'android') return;
  await n.setNotificationChannelAsync(CANAL, {
    name: 'Notifications Njangi',
    description: 'Tontines, dépôts et rappels de contribution',
    importance: n.AndroidImportance.HIGH,
    vibrationPattern: [0, 220, 180, 220],
    lightColor: '#90EED4',
    lockscreenVisibility: n.AndroidNotificationVisibility.PUBLIC,
    sound: 'default',
  });
}

/** État courant sans jamais ouvrir de boîte de dialogue. */
export async function getPermissionState(): Promise<PermissionState> {
  const n = getApi();
  if (!n) return 'unsupported';
  try {
    const { status } = await n.getPermissionsAsync();
    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'undetermined';
  } catch {
    return 'unsupported';
  }
}

/** Demande l'autorisation (une seule boîte de dialogue par installation). */
export async function requestPermission(): Promise<PermissionState> {
  const n = getApi();
  if (!n) return 'unsupported';
  try {
    await creerCanal(n);
    const { status } = await n.getPermissionsAsync();
    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    const demande = await n.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return demande.granted ? 'granted' : 'denied';
  } catch (erreur) {
    console.warn('[notifications] autorisation refusée', erreur);
    return 'denied';
  }
}

/** Affiche immédiatement une notification système. */
export async function notifyLocal(titre: string, message: string): Promise<boolean> {
  const n = getApi();
  if (!n) return false;
  try {
    await creerCanal(n);
    await n.scheduleNotificationAsync({
      content: {
        title: titre,
        body: message,
        sound: 'default',
      },
      trigger: null,
    });
    return true;
  } catch (erreur) {
    console.warn('[notifications] envoi impossible', erreur);
    return false;
  }
}

/** Rappel programmé (ex. prochaine échéance), conservé pour la démo. */
export async function planifierRappel(
  titre: string,
  message: string,
  dansSecondes: number,
): Promise<string | null> {
  const n = getApi();
  if (!n) return null;
  try {
    await creerCanal(n);
    return await n.scheduleNotificationAsync({
      content: { title: titre, body: message, sound: 'default' },
      trigger: {
        type: n.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(dansSecondes, 1),
      },
    });
  } catch {
    return null;
  }
}
