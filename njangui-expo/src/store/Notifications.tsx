import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getPermissionState,
  notifyLocal,
  PermissionState,
  requestPermission,
} from '../services/notifications';

const CLE = 'njangi.notifications.enabled';

type NotificationsValue = {
  /** L'utilisateur accepte les notifications dans l'application. */
  enabled: boolean;
  /** Autorisation système accordée. */
  permission: PermissionState;
  /** Premier chargement terminé. */
  ready: boolean;
  setEnabled: (valeur: boolean) => Promise<PermissionState>;
  /** Déclenche une notification système (no-op si désactivé). */
  notify: (titre: string, message: string) => void;
  envoyerTest: () => Promise<boolean>;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enabled, setEnabledState] = useState(true);
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let actif = true;

    (async () => {
      const stocke = await AsyncStorage.getItem(CLE).catch(() => null);
      const souhaite = stocke !== 'false';

      if (actif) setEnabledState(souhaite);

      const etat = souhaite
        ? await requestPermission()
        : await getPermissionState();

      if (!actif) return;
      setPermission(etat);
      setReady(true);
    })();

    return () => {
      actif = false;
    };
  }, []);

  const setEnabled = useCallback(async (valeur: boolean) => {
    setEnabledState(valeur);
    AsyncStorage.setItem(CLE, valeur ? 'true' : 'false').catch(() => {});

    if (!valeur) return permission;

    const etat = await requestPermission();
    setPermission(etat);
    if (etat !== 'granted') {
      setEnabledState(false);
      AsyncStorage.setItem(CLE, 'false').catch(() => {});
    }
    return etat;
  }, [permission]);

  const notify = useCallback(
    (titre: string, message: string) => {
      if (!enabled || Platform.OS === 'web') return;
      void notifyLocal(titre, message);
    },
    [enabled],
  );

  const envoyerTest = useCallback(
    () => notifyLocal('Njangi', 'Les notifications fonctionnent sur ce téléphone.'),
    [],
  );

  const value = useMemo<NotificationsValue>(
    () => ({ enabled, permission, ready, setEnabled, notify, envoyerTest }),
    [enabled, permission, ready, setEnabled, notify, envoyerTest],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications doit être utilisé dans NotificationsProvider',
    );
  }
  return context;
}
