import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light, Palette } from '../theme';

export type ThemeMode = 'light' | 'dark' | 'system';
type Scheme = 'light' | 'dark';

const CLE = 'njangui.theme.mode';
/** Clé de l'ancienne version, lue une seule fois pour ne pas perdre le choix. */
const ANCIENNE_CLE = 'njangi.theme.mode';

type ThemeValue = {
  mode: ThemeMode;
  /** Thème réellement appliqué (le mode système est résolu ici). */
  scheme: Scheme;
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let actif = true;
    AsyncStorage.getItem(CLE)
      .catch(() => null)
      .then((stocke) => stocke ?? AsyncStorage.getItem(ANCIENNE_CLE).catch(() => null))
      .then((valeur) => {
        if (!actif) return;
        if (valeur === 'light' || valeur === 'dark' || valeur === 'system') {
          setModeState(valeur);
        }
      })
      .catch(() => {});
    return () => {
      actif = false;
    };
  }, []);

  const setMode = useCallback((suivant: ThemeMode) => {
    setModeState(suivant);
    AsyncStorage.setItem(CLE, suivant).catch(() => {});
  }, []);

  const scheme: Scheme =
    mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      scheme,
      colors: scheme === 'dark' ? dark : light,
      setMode,
    }),
    [mode, scheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans ThemeProvider');
  }
  return context;
}

/**
 * Fabrique les styles d'un écran à partir de la palette courante.
 * `makeStyles` doit être déclaré au niveau du module pour rester stable.
 */
export function useStyles<T>(makeStyles: (c: Palette) => T): T {
  const { colors } = useTheme();
  return useMemo(() => makeStyles(colors), [makeStyles, colors]);
}
