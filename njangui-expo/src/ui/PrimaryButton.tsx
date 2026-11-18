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
import { colors } from '../theme';

type Variant = 'mint' | 'green' | 'purple' | 'danger';

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

const FOND: Record<Variant, string> = {
  mint: colors.mint,
  green: colors.green,
  purple: colors.purple,
  danger: '#E53935',
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
  const couleurTexte = variant === 'mint' ? colors.text : colors.white;
  const inactif = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: FOND[variant], height },
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

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconeGauche: {
    marginRight: 8,
  },
  iconeDroite: {
    marginLeft: 10,
  },
  inactif: {
    opacity: 0.6,
  },
  presse: {
    opacity: 0.85,
  },
});
