import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette, radius } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { Tontine } from '../types';
import { formatMontant } from '../utils/format';

type Props = {
  tontine: Tontine;
  onPress: () => void;
};

export function TontineCard({ tontine, onPress }: Props) {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();

  const payes = tontine.membres.filter((m) => m.aPaye).length;
  const total = tontine.membres.length;
  const ratio = total === 0 ? 0 : payes / total;

  const badge = tontine.enCours
    ? { texte: 'En cours', couleur: colors.green, fond: colors.greenSoft }
    : { texte: 'À venir', couleur: colors.purple, fond: colors.purpleSoft };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Tontine ${tontine.nom}`}
      style={({ pressed }) => [styles.card, pressed && styles.presse]}
    >
      <View style={styles.haut}>
        <View style={styles.vignette}>
          <MaterialIcons name="diversity-3" size={22} color={colors.purple} />
        </View>

        <View style={styles.titreZone}>
          <Text style={styles.nom} numberOfLines={1}>
            {tontine.nom}
          </Text>
          <Text style={styles.montant}>
            {formatMontant(tontine.montant)} FCFA / {tontine.frequence}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: badge.fond }]}>
          <Text style={[styles.badgeTexte, { color: badge.couleur }]}>
            {badge.texte}
          </Text>
        </View>
      </View>

      <View style={styles.pied}>
        <View style={styles.piedBloc}>
          <MaterialIcons name="event" size={13} color={colors.textFaint} />
          <Text style={styles.piedTexte}>{tontine.prochaineEcheance}</Text>
        </View>
        <View style={styles.piedBloc}>
          <MaterialIcons name="people" size={13} color={colors.textFaint} />
          <Text style={styles.piedTexte}>
            {payes}/{total} payés
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={18} color={colors.textFaint} />
      </View>

      <View style={styles.piste}>
        <View
          style={[
            styles.pisteRemplie,
            {
              width: `${Math.round(ratio * 100)}%`,
              backgroundColor: ratio === 1 ? colors.green : colors.mint,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      marginBottom: 12,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 12,
    },
    presse: {
      opacity: 0.9,
    },
    haut: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vignette: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: c.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titreZone: {
      flex: 1,
      marginLeft: 12,
    },
    nom: {
      fontSize: 15.5,
      fontWeight: '600',
      color: c.text,
    },
    montant: {
      marginTop: 3,
      fontSize: 12.5,
      color: c.textMuted,
    },
    badge: {
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
    },
    badgeTexte: {
      fontSize: 11,
      fontWeight: '600',
    },
    pied: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    piedBloc: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    piedTexte: {
      fontSize: 12,
      color: c.textMuted,
    },
    piste: {
      marginTop: 12,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.cardMuted,
      overflow: 'hidden',
    },
    pisteRemplie: {
      height: '100%',
      borderRadius: 3,
    },
  });
