import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';

type Variant = 'mint' | 'green' | 'purple' | 'danger' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  height?: number;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'mint',
  loading = false,
  disabled = false,
  height = 55,
  leftIcon,
  rightIcon,
  labelStyle,
  style,
}: Props) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  const fond: Record<Variant, string> = {
    mint: colors.mint,
    green: colors.greenSolid,
    purple: colors.purpleSolid,
    danger: colors.redDark,
    ghost: colors.cardMuted,
  };
  const couleurTexte =
    variant === 'mint'
      ? colors.onMint
      : variant === 'ghost'
        ? colors.text
        : colors.onAccent;

  const inactif = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactif}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactif, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: fond[variant], height },
        inactif && styles.inactif,
        pressed && !inactif && styles.presse,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={couleurTexte} />
      ) : (
        <View style={styles.contenu}>
          {leftIcon ? (
            <MaterialIcons
              name={leftIcon}
              size={20}
              color={couleurTexte}
              style={styles.iconeGauche}
            />
          ) : null}
          <Text style={[styles.label, { color: couleurTexte }, labelStyle]}>
            {label}
          </Text>
          {rightIcon ? (
            <MaterialIcons
              name={rightIcon}
              size={18}
              color={couleurTexte}
              style={styles.iconeDroite}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    base: {
      width: '100%',
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    contenu: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    iconeGauche: {
      marginRight: 8,
    },
    iconeDroite: {
      marginLeft: 10,
    },
    inactif: {
      opacity: 0.55,
    },
    presse: {
      opacity: 0.88,
    },
  });
