import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { LogoMark } from './Logo';

type Props = {
  size?: number;
  /**
   * Délai avant apparition : une attente plus courte que ça n'affiche rien,
   * pour éviter le clignotement sur les actions instantanées.
   */
  delay?: number;
  color?: string;
};

/**
 * Chargement « la ronde » : la marque tourne lentement, sans texte ni
 * indicateur générique. Respecte la préférence système de réduction des
 * animations (marque immobile dans ce cas).
 */
export function LogoLoader({ size = 32, delay = 220, color }: Props) {
  const tour = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(delay === 0);
  const [reduire, setReduire] = useState(false);

  useEffect(() => {
    if (delay === 0) return;
    const minuteur = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(minuteur);
  }, [delay]);

  useEffect(() => {
    let actif = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valeur) => {
        if (actif) setReduire(valeur);
      })
      .catch(() => {});
    return () => {
      actif = false;
    };
  }, []);

  useEffect(() => {
    if (!visible || reduire) return;
    const boucle = Animated.loop(
      Animated.timing(tour, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    boucle.start();
    return () => boucle.stop();
  }, [visible, reduire, tour]);

  if (!visible) return <View style={{ width: size, height: size }} />;

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          opacity: tour.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.9, 1, 0.9],
          }),
          transform: [
            {
              rotate: tour.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <LogoMark size={size} tone={color ? 'mono' : 'auto'} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
