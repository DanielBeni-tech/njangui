import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { MOIS } from '../utils/format';

type Props = {
  visible: boolean;
  value: Date;
  minimumDate?: Date;
  title?: string;
  onCancel: () => void;
  onConfirm: (date: Date) => void;
};

const INITIALES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const debutDuMois = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const memeJour = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Sélecteur de date en français, identique sur iOS, Android et web
 * (remplace le `showDatePicker` de Flutter).
 */
export function DatePickerModal({
  visible,
  value,
  minimumDate,
  title = 'Choisir une date',
  onCancel,
  onConfirm,
}: Props) {
  const [curseur, setCurseur] = useState(() => debutDuMois(value));
  const [selection, setSelection] = useState(value);

  useEffect(() => {
    if (visible) {
      setCurseur(debutDuMois(value));
      setSelection(value);
    }
  }, [visible, value]);

  const annee = curseur.getFullYear();
  const moisIndex = curseur.getMonth();
  const decalage = (new Date(annee, moisIndex, 1).getDay() + 6) % 7;
  const nbJours = new Date(annee, moisIndex + 1, 0).getDate();
  const cases: Array<number | null> = [
    ...Array.from({ length: decalage }, () => null),
    ...Array.from({ length: nbJours }, (_, i) => i + 1),
  ];

  const estDesactive = (jour: number) => {
    if (!minimumDate) return false;
    const date = new Date(annee, moisIndex, jour);
    const min = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      minimumDate.getDate(),
    );
    return date.getTime() < min.getTime();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.fond}>
        <View style={styles.carte}>
          <Text style={styles.titre}>{title}</Text>

          <View style={styles.moisLigne}>
            <Pressable
              hitSlop={12}
              onPress={() => setCurseur(new Date(annee, moisIndex - 1, 1))}
            >
              <MaterialIcons
                name="chevron-left"
                size={28}
                color={colors.purple}
              />
            </Pressable>
            <Text style={styles.moisTexte}>
              {MOIS[moisIndex]} {annee}
            </Text>
            <Pressable
              hitSlop={12}
              onPress={() => setCurseur(new Date(annee, moisIndex + 1, 1))}
            >
              <MaterialIcons
                name="chevron-right"
                size={28}
                color={colors.purple}
              />
            </Pressable>
          </View>

          <View style={styles.grille}>
            {INITIALES.map((initiale, index) => (
              <View key={`j-${index}`} style={styles.case}>
                <Text style={styles.jourSemaine}>{initiale}</Text>
              </View>
            ))}
            {cases.map((jour, index) => {
              if (jour === null) {
                return <View key={`vide-${index}`} style={styles.case} />;
              }
              const date = new Date(annee, moisIndex, jour);
              const selectionne = memeJour(selection, date);
              const desactive = estDesactive(jour);
              return (
                <Pressable
                  key={`jour-${jour}`}
                  style={styles.case}
                  disabled={desactive}
                  onPress={() => setSelection(date)}
                >
                  <View style={[styles.jour, selectionne && styles.jourActif]}>
                    <Text
                      style={[
                        styles.jourTexte,
                        selectionne && styles.jourTexteActif,
                        desactive && styles.jourTexteInactif,
                      ]}
                    >
                      {jour}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} hitSlop={8}>
              <Text style={styles.annuler}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(selection)}
              style={({ pressed }) => [
                styles.valider,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.validerTexte}>Valider</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  carte: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  titre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  moisLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moisTexte: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  grille: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  case: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  jourSemaine: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.greyText,
    paddingVertical: 6,
  },
  jour: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jourActif: {
    backgroundColor: colors.purple,
  },
  jourTexte: {
    fontSize: 15,
    color: colors.text,
  },
  jourTexteActif: {
    color: colors.white,
    fontWeight: 'bold',
  },
  jourTexteInactif: {
    color: colors.borderStrong,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  annuler: {
    fontSize: 15,
    color: colors.greyText,
    marginRight: 24,
  },
  valider: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  validerTexte: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
