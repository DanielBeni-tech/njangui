import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette } from '../theme';
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

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Tontine ${tontine.nom}`}
      style={({ pressed }) => [styles.card, pressed && styles.presse]}
    >
      <View
        style={[
          styles.accent,
          {
            backgroundColor: tontine.enCours ? colors.green : colors.purple,
          },
        ]}
      />

      <View style={styles.corps}>
        <View style={styles.ligneTitre}>
          <View style={styles.titreZone}>
            <Text style={styles.nom} numberOfLines={1}>
              {tontine.nom}
            </Text>
            <Text style={styles.montant}>
              {formatMontant(tontine.montant)} FCFA / {tontine.frequence}
            </Text>
          </View>

          <View
            style={[
              styles.etat,
              {
                backgroundColor: tontine.enCours
                  ? colors.greenSoft
                  : colors.purpleSoft,
              },
            ]}
          >
            <View
              style={[
                styles.point,
                {
                  backgroundColor: tontine.enCours
                    ? colors.green
                    : colors.purple,
                },
              ]}
            />
            <Text
              style={[
                styles.etatTexte,
                {
                  color: tontine.enCours ? colors.green : colors.purple,
                },
              ]}
            >
              {tontine.enCours ? 'En cours' : 'À venir'}
            </Text>
          </View>
        </View>

        <View style={styles.pied}>
          <View style={styles.piedBloc}>
            <MaterialIcons
              name="event"
              size={14}
              color={colors.textFaint}
            />
            <Text style={styles.piedTexte}>
              {tontine.enCours
                ? tontine.prochaineEcheance
                : tontine.prochaineEcheance}
            </Text>
          </View>

          <View style={styles.piedBloc}>
            <MaterialIcons
              name="group"
              size={14}
              color={colors.textFaint}
            />
            <Text style={styles.piedTexte}>
              {payes}/{total} payés
            </Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={20}
            color={colors.textFaint}
          />
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
      </View>
    </Pressable>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      marginBottom: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      flexDirection: 'row',
      overflow: 'hidden',
      shadowColor: c.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 1,
    },
    presse: {
      opacity: 0.9,
    },
    accent: {
      width: 5,
    },
    corps: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    ligneTitre: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    titreZone: {
      flex: 1,
    },
    nom: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
      letterSpacing: 0,
    },
    montant: {
      marginTop: 4,
      fontSize: 13.5,
      color: c.textMuted,
    },
    etat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 20,
    },
    point: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    etatTexte: {
      fontSize: 11,
      fontWeight: '700',
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
      color: c.textFaint,
    },
    piste: {
      marginTop: 12,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.cardMuted,
      overflow: 'hidden',
    },
    pisteRemplie: {
      height: '100%',
      borderRadius: 3,
    },
  });
