import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { TontineCard } from '../../ui/TontineCard';
import { useAppData } from '../../store/AppData';

type Filtre = 'toutes' | 'encours' | 'avenir';

const FILTRES: Array<{ id: Filtre; label: string }> = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'encours', label: 'En cours' },
  { id: 'avenir', label: 'À venir' },
];

export default function TontinesScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { tontines } = useAppData();
  const [filtre, setFiltre] = useState<Filtre>('toutes');

  const liste = useMemo(() => {
    if (filtre === 'encours') return tontines.filter((t) => t.enCours);
    if (filtre === 'avenir') return tontines.filter((t) => !t.enCours);
    return tontines;
  }, [filtre, tontines]);

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.entete}>
        <View>
          <Text style={styles.titre}>Mes tontines</Text>
          <Text style={styles.sousTitre}>
            {tontines.length} tontine{tontines.length > 1 ? 's' : ''} au total
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/rejoindre')}
          hitSlop={8}
          style={({ pressed }) => [
            styles.rejoindre,
            pressed && styles.presse,
          ]}
        >
          <MaterialIcons name="group-add" size={18} color={colors.purple} />
          <Text style={styles.rejoindreTexte}>Rejoindre</Text>
        </Pressable>
      </View>

      <View style={styles.filtres}>
        {FILTRES.map((option) => {
          const actif = filtre === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setFiltre(option.id)}
              style={({ pressed }) => [
                styles.filtre,
                actif && styles.filtreActif,
                pressed && !actif && styles.presse,
              ]}
            >
              <Text
                style={[styles.filtreTexte, actif && styles.filtreTexteActif]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
      >
        {liste.length === 0 ? (
          <View style={styles.vide}>
            <MaterialIcons
              name="groups"
              size={40}
              color={colors.textFaint}
            />
            <Text style={styles.videTitre}>
              Aucune tontine dans cette vue
            </Text>
            <Text style={styles.videTexte}>
              Créez une tontine ou rejoignez-en une avec un code d’invitation.
            </Text>
          </View>
        ) : (
          liste.map((tontine) => (
            <TontineCard
              key={tontine.id}
              tontine={tontine}
              onPress={() =>
                router.push({
                  pathname: '/tontine/[id]',
                  params: { id: tontine.id },
                })
              }
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/creation')}
        accessibilityLabel="Créer une tontine"
        style={({ pressed }) => [styles.fab, pressed && styles.presse]}
      >
        <MaterialIcons name="add" size={28} color={colors.onAccent} />
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ecran: {
      flex: 1,
      backgroundColor: c.background,
    },
    entete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: screenPadding,
      paddingTop: 18,
    },
    titre: {
      fontSize: 24,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    sousTitre: {
      marginTop: 3,
      fontSize: 12.5,
      color: c.textFaint,
    },
    rejoindre: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.purpleSoft,
    },
    rejoindreTexte: {
      fontSize: 12.5,
      fontWeight: '700',
      color: c.purple,
    },
    presse: {
      opacity: 0.75,
    },
    filtres: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: screenPadding,
      marginTop: 16,
    },
    filtre: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    filtreActif: {
      backgroundColor: c.text,
      borderColor: c.text,
    },
    filtreTexte: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.textMuted,
    },
    filtreTexteActif: {
      color: c.background,
    },
    liste: {
      paddingHorizontal: screenPadding,
      paddingTop: 18,
      paddingBottom: 110,
    },
    vide: {
      alignItems: 'center',
      paddingVertical: 36,
      paddingHorizontal: 24,
      borderRadius: 18,
      backgroundColor: c.cardMuted,
      marginTop: 8,
    },
    videTitre: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
      textAlign: 'center',
    },
    videTexte: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
    fab: {
      position: 'absolute',
      right: screenPadding,
      bottom: 22,
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: c.greenSolid,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.shadow,
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    },
  });
