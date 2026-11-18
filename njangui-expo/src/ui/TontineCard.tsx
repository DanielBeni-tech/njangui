import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Tontine } from '../types';
import { formatMontant } from '../utils/format';

type Props = {
  tontine: Tontine;
  onPress: () => void;
};

export function TontineCard({ tontine, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.presse]}
    >
      <View
        style={[
          styles.haut,
          { backgroundColor: tontine.enCours ? colors.green : colors.mint },
        ]}
      >
        <View style={styles.hautTexte}>
          <Text style={styles.nom} numberOfLines={1}>
            {tontine.nom}
          </Text>
          <Text style={styles.montant}>
            {formatMontant(tontine.montant)} FCFA/{tontine.frequence}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.white} />
      </View>

      <View
        style={[
          styles.bas,
          { backgroundColor: tontine.enCours ? colors.mint : colors.white },
        ]}
      >
        <Text style={styles.basLabel}>Prochaine échéance</Text>
        <View style={styles.pillule}>
          <Text style={styles.pilluleTexte}>
            {tontine.enCours ? 'En cours' : tontine.prochaineEcheance}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  presse: {
    opacity: 0.9,
  },
  haut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  hautTexte: {
    flex: 1,
    marginRight: 12,
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  montant: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  bas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  basLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  pillule: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pilluleTexte: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
});
