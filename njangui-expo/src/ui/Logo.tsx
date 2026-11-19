import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useTheme } from '../store/Theme';

/**
 * Symbole Njangui : dix personnes en cercle, bras tendus vers l'espace
 * central — le pot commun. Même géométrie que `assets/brand/logo-symbol.svg`.
 */
const TONES = [
  '#6C2BD9',
  '#2F6BD8',
  '#12A9C6',
  '#4CAF50',
  '#8CC63F',
  '#F5A623',
  '#E6186C',
];

const COUNT = 10;
const R_OUT = 15;
const R_IN = 5.5;
const HEAD_R = 3;

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [32 + r * Math.cos(a), 32 + r * Math.sin(a)] as const;
};
const n = (v: number) => Number(v.toFixed(2));

const ARM = (() => {
  const [x0, y0] = polar(R_OUT, -18);
  const [x1, y1] = polar(R_OUT, 2);
  const [c1x, c1y] = polar(9.5, 16);
  const [x2, y2] = polar(R_IN, 38);
  const [x3, y3] = polar(R_IN, 14);
  const [c2x, c2y] = polar(11.5, -8);
  return (
    `M ${n(x0)} ${n(y0)} A ${R_OUT} ${R_OUT} 0 0 1 ${n(x1)} ${n(y1)} ` +
    `Q ${n(c1x)} ${n(c1y)} ${n(x2)} ${n(y2)} ` +
    `A ${R_IN} ${R_IN} 0 0 0 ${n(x3)} ${n(y3)} ` +
    `Q ${n(c2x)} ${n(c2y)} ${n(x0)} ${n(y0)} Z`
  );
})();

const [HEAD_X, HEAD_Y] = polar(16.8, -9);

type MarkProps = {
  size?: number;
  /** `auto` suit le thème, `mono` prend une couleur unique. */
  tone?: 'auto' | 'mono';
  color?: string;
  outline?: boolean;
};

export function LogoMark({ size = 64, tone = 'auto', color, outline }: MarkProps) {
  const { scheme, colors } = useTheme();
  const mono = tone === 'mono' ? color ?? colors.text : null;
  const stroke = outline ? (mono ?? colors.text) : null;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {Array.from({ length: COUNT }, (_, i) => {
        const fill = mono ?? TONES[i % TONES.length];
        return (
          <G key={i} transform={`rotate(${(360 / COUNT) * i} 32 32)`}>
            <Path
              d={ARM}
              fill={stroke ? 'none' : fill}
              stroke={stroke ?? 'none'}
              strokeWidth={stroke ? 1.5 : 0}
            />
            <Circle
              cx={HEAD_X}
              cy={HEAD_Y}
              r={HEAD_R}
              fill={stroke ? 'none' : fill}
              stroke={stroke ?? 'none'}
              strokeWidth={stroke ? 1.5 : 0}
            />
          </G>
        );
      })}
    </Svg>
  );
}

type LogoProps = MarkProps & {
  /** Ajoute « Njangui » à droite de la marque. */
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
          {
            color: colors.text,
            fontSize: nameSize,
            marginLeft: (mark.size ?? 64) * 0.22,
          },
        ]}
      >
        Njangui
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
    letterSpacing: -0.2,
  },
});
