import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme } from '../store/Theme';

/**
 * La marque : huit silhouettes en cercle, têtes vers l'extérieur, épaules
 * jointes autour d'un espace vide — le pot commun. Même géométrie que les
 * fichiers `assets/brand/*.svg`, mais rendue en vectoriel pour rester nette
 * et suivre le thème.
 */
const TONES_LIGHT = ['#6E2B7C', '#2A8390', '#2E8F68', '#B8862E'];
const TONES_DARK = ['#C9A2D9', '#6EC5D2', '#5FCB9B', '#E0AE5C'];

const BODY =
  'M -3.3 -2.5 L 3.3 -2.5 Q 5.4 -2.5 5.4 0.2 L 5.4 2.3 L -5.4 2.3 L -5.4 0.2 Q -5.4 -2.5 -3.3 -2.5 Z';

type MarkProps = {
  size?: number;
  /** `auto` suit le thème, `mono` prend la couleur du texte. */
  tone?: 'auto' | 'mono';
  color?: string;
  /** Six personnes et des formes plus épaisses, pour les très petites tailles. */
  compact?: boolean;
};

export function LogoMark({
  size = 64,
  tone = 'auto',
  color,
  compact = false,
}: MarkProps) {
  const { scheme, colors } = useTheme();
  const tones = tone === 'mono' ? [color ?? colors.text] : scheme === 'dark' ? TONES_DARK : TONES_LIGHT;
  const count = compact ? 6 : 8;
  const radius = compact ? 14.4 : 15;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {Array.from({ length: count }, (_, i) => {
        const theta = (360 / count) * i - 90;
        const cx = 32 + radius * Math.cos((theta * Math.PI) / 180);
        const cy = 32 + radius * Math.sin((theta * Math.PI) / 180);
        const fill = tones[i % tones.length];
        return (
          <G key={i} x={cx} y={cy} rotation={theta - 90}>
            <Path d={BODY} fill={fill} scale={compact ? 1.25 : 1} />
            <Circle cy={4.6} r={compact ? 3.9 : 3.25} fill={fill} />
          </G>
        );
      })}
    </Svg>
  );
}

type LogoProps = MarkProps & {
  /** Affiche « NJANGUI » à droite de la marque. */
  withName?: boolean;
  nameSize?: number;
};

export function Logo({ withName = false, nameSize = 17, ...mark }: LogoProps) {
  const { colors } = useTheme();

  if (!withName) return <LogoMark {...mark} />;

  return (
    <View style={styles.row}>
      <LogoMark {...mark} />
      <Text
        style={[
          styles.name,
          { color: colors.text, fontSize: nameSize, marginLeft: (mark.size ?? 64) * 0.2 },
        ]}
      >
        NJANGUI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    letterSpacing: 2.6,
  },
});
