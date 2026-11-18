import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';

type Props = {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
};

export function CheckboxRow({ label, value, onToggle }: Props) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onToggle(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      style={({ pressed }) => [
        styles.row,
        value && styles.rowActive,
        pressed && styles.presse,
      ]}
    >
      <View style={[styles.box, value && styles.boxCochee]}>
        {value ? (
          <MaterialIcons name="check" size={15} color={colors.onAccent} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 15,
      marginBottom: 10,
      backgroundColor: c.card,
    },
    rowActive: {
      borderColor: c.borderStrong,
      backgroundColor: c.backgroundAlt,
    },
    presse: { opacity: 0.8 },
    box: {
      width: 22,
      height: 22,
      borderRadius: 7,
      borderWidth: 1.5,
      borderColor: c.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    boxCochee: {
      backgroundColor: c.greenSolid,
      borderColor: c.greenSolid,
    },
    label: {
      flex: 1,
      fontSize: 14.5,
      color: c.text,
    },
  });
