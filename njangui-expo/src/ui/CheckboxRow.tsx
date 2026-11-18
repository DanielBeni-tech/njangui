import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
};

export function CheckboxRow({ label, value, onToggle }: Props) {
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      style={({ pressed }) => [styles.row, pressed && styles.presse]}
    >
      <View style={[styles.box, value && styles.boxCochee]}>
        {value ? (
          <MaterialIcons name="check" size={16} color={colors.white} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  presse: { opacity: 0.8 },
  box: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boxCochee: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
});
