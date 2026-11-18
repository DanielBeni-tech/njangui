import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
import { useStyles, useTheme, ThemeMode } from '../store/Theme';

const OPTIONS: Array<{
  mode: ThemeMode;
  icone: keyof typeof MaterialIcons.glyphMap;
  label: string;
}> = [
  { mode: 'light', icone: 'light-mode', label: 'Clair' },
  { mode: 'dark', icone: 'dark-mode', label: 'Sombre' },
  { mode: 'system', icone: 'brightness-auto', label: 'Auto' },
];

type Props = {
  /** Icônes seules (écran de connexion) ou icônes + libellés (profil). */
  compact?: boolean;
};

export function ThemeSwitch({ compact = false }: Props) {
  const styles = useStyles(makeStyles);
  const { mode, setMode, colors } = useTheme();

  return (
    <View style={styles.rail} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const actif = mode === option.mode;
        return (
          <Pressable
            key={option.mode}
            onPress={() => setMode(option.mode)}
            accessibilityRole="radio"
            accessibilityState={{ selected: actif }}
            accessibilityLabel={`Thème ${option.label}`}
            style={({ pressed }) => [
              styles.segment,
              compact && styles.segmentCompact,
              actif && styles.segmentActif,
              pressed && !actif && styles.presse,
            ]}
          >
            <MaterialIcons
              name={option.icone}
              size={18}
              color={actif ? colors.onAccent : colors.textMuted}
            />
            {compact ? null : (
              <Text
                style={[styles.label, actif && styles.labelActif]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    rail: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardMuted,
      borderRadius: 12,
      padding: 3,
      gap: 4,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    segmentCompact: {
      flex: 0,
      minWidth: 44,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    segmentActif: {
      backgroundColor: c.purpleSolid,
    },
    presse: {
      opacity: 0.7,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textMuted,
    },
    labelActif: {
      color: c.onAccent,
    },
  });
