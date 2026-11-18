import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';

type Props = {
  title: string;
  onPress: () => void;
};

export function BackHeader({ title, onPress }: Props) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={`Retour — ${title}`}
      style={({ pressed }) => [styles.row, pressed && styles.presse]}
    >
      <View style={styles.chevronBoite}>
        <MaterialIcons
          name="chevron-left"
          size={22}
          color={colors.text}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    presse: {
      opacity: 0.7,
    },
    chevronBoite: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    title: {
      flex: 1,
      fontSize: 19,
      fontWeight: '700',
      color: c.text,
      letterSpacing: -0.2,
    },
  });
