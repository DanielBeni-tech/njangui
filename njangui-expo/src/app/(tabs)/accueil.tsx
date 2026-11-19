import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, radius, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { Logo } from '../../ui/Logo';
import { TontineCard } from '../../ui/TontineCard';
import { useAppData } from '../../store/AppData';

export default function AccueilScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { tontines, nonLues } = useAppData();

  const membres = tontines.reduce((total, t) => total + t.membres.length, 0);
  const enCours = tontines.filter((t) => t.enCours).length;

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.entete}>
          <View style={styles.marque}>
            <Logo size={42} />
            <View style={styles.marqueTexte}>
              <Text style={styles.nom}>Njangui</Text>
              <Text style={styles.signature}>La tontine, sans conflit</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/alertes')}
            accessibilityLabel="Voir les alertes"
            hitSlop={8}
            style={({ pressed }) => [styles.cloche, pressed && styles.presse]}
          >
            <MaterialIcons
              name={nonLues > 0 ? 'notifications' : 'notifications-none'}
              size={21}
              color={colors.text}
            />
            {nonLues > 0 ? <View style={styles.pastille} /> : null}
          </Pressable>
        </View>

        <Text style={styles.bonjour}>Bonjour Mégane</Text>
        <Text style={styles.sousBonjour}>
          Voici l’état de vos tontines aujourd’hui.
        </Text>

        <View style={styles.hero}>
          <View style={styles.heroIcone}>
            <MaterialIcons name="verified-user" size={19} color={colors.mint} />
          </View>
          <Text style={styles.heroTitre}>
            Créez vos tontines en toute transparence
          </Text>
          <Text style={styles.heroTexte}>
            Règles claires, paiements suivis, zéro conflit.
          </Text>

          <View style={styles.heroActions}>
            <Pressable
              onPress={() => router.push('/creation')}
              style={({ pressed }) => [styles.heroBouton, pressed && styles.presse]}
            >
              <MaterialIcons name="add" size={18} color={colors.navy} />
              <Text style={styles.heroBoutonTexte}>Créer</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/rejoindre')}
              style={({ pressed }) => [
                styles.heroBoutonFantome,
                pressed && styles.presse,
              ]}
            >
              <MaterialIcons name="group-add" size={18} color={colors.onAccent} />
              <Text style={styles.heroBoutonFantomeTexte}>Rejoindre</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialIcons name="groups" size={18} color={colors.purple} />
            <Text style={styles.statValeur}>{tontines.length}</Text>
            <Text style={styles.statLabel}>Tontines</Text>
          </View>
          <View style={styles.separateur} />
          <View style={styles.stat}>
            <MaterialIcons name="people" size={18} color={colors.teal} />
            <Text style={styles.statValeur}>{membres}</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={styles.separateur} />
          <View style={styles.stat}>
            <MaterialIcons name="event-available" size={18} color={colors.green} />
            <Text style={styles.statValeur}>{enCours}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
        </View>

        <View style={styles.sectionLigne}>
          <Text style={styles.section}>Mes tontines</Text>
          {tontines.length > 0 ? (
            <Pressable
              onPress={() => router.push('/tontines')}
              hitSlop={10}
              style={({ pressed }) => [styles.voir, pressed && styles.presse]}
            >
              <Text style={styles.voirTexte}>Tout voir</Text>
              <MaterialIcons name="arrow-forward" size={14} color={colors.purple} />
            </Pressable>
          ) : null}
        </View>

        {tontines.length === 0 ? (
          <View style={styles.vide}>
            <MaterialIcons name="groups" size={34} color={colors.textFaint} />
            <Text style={styles.videTitre}>Aucune tontine</Text>
            <Text style={styles.videTexte}>
              Créez la vôtre ou entrez un code d’invitation.
            </Text>
          </View>
        ) : (
          tontines.map((tontine) => (
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
    </SafeAreaView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ecran: {
      flex: 1,
      backgroundColor: c.background,
    },
    contenu: {
      paddingHorizontal: screenPadding,
      paddingTop: 16,
      paddingBottom: 28,
    },
    entete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    marque: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    marqueTexte: {
      marginLeft: 10,
    },
    nom: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
    },
    signature: {
      marginTop: 1,
      fontSize: 10.5,
      color: c.textMuted,
    },
    cloche: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pastille: {
      position: 'absolute',
      top: 9,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.red,
    },
    presse: {
      opacity: 0.75,
    },
    bonjour: {
      marginTop: 24,
      fontSize: 26,
      fontWeight: '700',
      color: c.text,
    },
    sousBonjour: {
      marginTop: 4,
      fontSize: 13.5,
      color: c.textMuted,
    },
    hero: {
      marginTop: 16,
      backgroundColor: c.navy,
      borderRadius: radius.container,
      padding: 18,
    },
    heroIcone: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.10)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitre: {
      marginTop: 14,
      fontSize: 17,
      lineHeight: 23,
      fontWeight: '700',
      color: c.onAccent,
    },
    heroTexte: {
      marginTop: 6,
      fontSize: 12.5,
      lineHeight: 18,
      color: 'rgba(255,255,255,0.72)',
    },
    heroActions: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 10,
    },
    heroBouton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingHorizontal: 18,
      height: 42,
      borderRadius: radius.button,
      backgroundColor: c.onAccent,
    },
    heroBoutonTexte: {
      fontSize: 14,
      fontWeight: '600',
      color: c.navy,
    },
    heroBoutonFantome: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingHorizontal: 18,
      height: 42,
      borderRadius: radius.button,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.35)',
    },
    heroBoutonFantomeTexte: {
      fontSize: 14,
      fontWeight: '600',
      color: c.onAccent,
    },
    stats: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 16,
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    statValeur: {
      marginTop: 4,
      fontSize: 19,
      fontWeight: '700',
      color: c.text,
    },
    statLabel: {
      fontSize: 11.5,
      color: c.textMuted,
    },
    separateur: {
      width: 1,
      height: 34,
      backgroundColor: c.border,
    },
    sectionLigne: {
      marginTop: 26,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    section: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    voir: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    voirTexte: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    vide: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 24,
      borderRadius: radius.card,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    videTitre: {
      marginTop: 10,
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
    },
    videTexte: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
  });
