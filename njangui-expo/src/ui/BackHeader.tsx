import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
};

export function BackHeader({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [styles.row, pressed && styles.presse]}
    >
      <MaterialIcons name="chevron-left" size={26} color={colors.purple} style={styles.chevron} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presse: {
    opacity: 0.7,
  },
  chevron: {
    marginLeft: -6,
    marginRight: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.purple,
  },
});
