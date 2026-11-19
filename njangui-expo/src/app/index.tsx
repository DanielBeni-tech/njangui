import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { LogoMark } from '../ui/Logo';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ThemeSwitch } from '../ui/ThemeSwitch';

/**
 * Couverture : la marque, le nom et la promesse. Un seul geste à faire.
 */
export default function CouvertureScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const entree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entree, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entree]);

  const montee = entree.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <View style={styles.haut} />

      <Animated.View
        style={[
          styles.centre,
          { opacity: entree, transform: [{ translateY: montee }] },
        ]}
      >
        <LogoMark size={176} />

        <Text style={styles.nom}>NJANGUI</Text>
        <Text style={styles.hook}>La tontine sans conflit</Text>
      </Animated.View>

      <Animated.View style={[styles.bas, { opacity: entree }]}>
        <PrimaryButton
          label="Commencer"
          onPress={() => router.push('/connexion')}
          variant="purple"
          rightIcon="arrow-forward"
        />
        <View style={styles.apparence}>
          <ThemeSwitch compact />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ecran: {
      flex: 1,
      backgroundColor: c.background,
      paddingHorizontal: 28,
    },
    haut: { flex: 1, minHeight: 12 },
    centre: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 24,
    },
    nom: {
      marginTop: 26,
      fontSize: 26,
      fontWeight: '700',
      letterSpacing: 7,
      color: c.text,
      textAlign: 'center',
    },
    hook: {
      marginTop: 12,
      fontSize: 16.5,
      lineHeight: 23,
      color: c.textMuted,
      textAlign: 'center',
    },
    bas: {
      paddingBottom: 10,
    },
    apparence: {
      marginTop: 18,
      alignItems: 'center',
    },
  });
