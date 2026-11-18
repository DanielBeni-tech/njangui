import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';

type ToastKind = 'default' | 'success' | 'error';
type ShowToast = (message: string, kind?: ToastKind) => void;

const ToastContext = createContext<ShowToast>(() => {});

const ICONES: Record<ToastKind, keyof typeof MaterialIcons.glyphMap> = {
  default: 'info-outline',
  success: 'check-circle-outline',
  error: 'error-outline',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const [toast, setToast] = useState<{ message: string; kind: ToastKind } | null>(
    null,
  );
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ShowToast>(
    (message, kind = 'default') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, kind });
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setToast(null);
        });
      }, 2400);
    },
    [opacity],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const fond: Record<ToastKind, string> = {
    default: colors.toast,
    success: colors.greenSolid,
    error: colors.redDark,
  };

  return (
    <ToastContext.Provider value={show}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <Animated.View
            pointerEvents="none"
            accessibilityLiveRegion="polite"
            style={[
              styles.toast,
              { backgroundColor: fond[toast.kind], opacity },
            ]}
          >
            <MaterialIcons
              name={ICONES[toast.kind]}
              size={18}
              color={colors.onAccent}
            />
            <Text style={styles.text}>{toast.message}</Text>
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    root: { flex: 1 },
    toast: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      zIndex: 1000,
      elevation: 6,
    },
    text: {
      flex: 1,
      color: c.onAccent,
      fontSize: 14.5,
      fontWeight: '500',
    },
  });
