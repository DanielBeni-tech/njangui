import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type ToastKind = 'default' | 'success' | 'error';
type ShowToast = (message: string, kind?: ToastKind) => void;

const ToastContext = createContext<ShowToast>(() => {});

const FOND: Record<ToastKind, string> = {
  default: colors.toast,
  success: colors.green,
  error: colors.redDark,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <ToastContext.Provider value={show}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toast,
              { backgroundColor: FOND[toast.kind], opacity },
            ]}
          >
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 1000,
    elevation: 6,
  },
  text: {
    color: colors.white,
    fontSize: 15,
  },
});
