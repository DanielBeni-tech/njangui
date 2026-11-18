import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
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
            <Image
              source={require('../../../assets/images/njangi_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.marqueTexte}>
              <Text style={styles.nom}>Njangi</Text>
              <Text style={styles.slogan}>la tontine, sans conflit</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/alertes')}
            accessibilityLabel="Voir les notifications"
            style={({ pressed }) => [styles.cloche, pressed && styles.presse]}
          >
            <MaterialIcons
              name="notifications-none"
              size={22}
              color={colors.text}
            />
            {nonLues > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeTexte}>{nonLues}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <Text style={styles.bonjour}>Bonjour Mégane</Text>
        <Text style={styles.sousBonjour}>
          Voici l’état de vos tontines aujourd’hui.
        </Text>

        <View style={styles.hero}>
          <View style={styles.heroIcone}>
            <MaterialIcons name="savings" size={22} color={colors.onMint} />
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
              style={({ pressed }) => [
                styles.heroBouton,
                pressed && styles.presse,
              ]}
            >
              <MaterialIcons name="add" size={18} color={colors.onAccent} />
              <Text style={styles.heroBoutonTexte}>Créer</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/rejoindre')}
              style={({ pressed }) => [
                styles.heroBoutonFantome,
                pressed && styles.presse,
              ]}
            >
              <MaterialIcons name="group-add" size={18} color={colors.onMint} />
              <Text style={styles.heroBoutonFantomeTexte}>Rejoindre</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValeur}>{tontines.length}</Text>
            <Text style={styles.statLabel}>Tontines</Text>
          </View>
          <View style={styles.separateur} />
          <View style={styles.stat}>
            <Text style={styles.statValeur}>{membres}</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={styles.separateur} />
          <View style={styles.stat}>
            <Text style={styles.statValeur}>{enCours}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
        </View>

        <View style={styles.sectionLigne}>
          <Text style={styles.section}>Mes tontines</Text>
          {tontines.length > 0 ? (
            <Pressable onPress={() => router.push('/tontines')} hitSlop={8}>
              <Text style={styles.voirTout}>Tout voir</Text>
            </Pressable>
          ) : null}
        </View>

        {tontines.length === 0 ? (
          <View style={styles.vide}>
            <MaterialIcons
              name="groups"
              size={40}
              color={colors.textFaint}
            />
            <Text style={styles.videTitre}>Aucune tontine pour l’instant</Text>
            <Text style={styles.videTexte}>
              Créez votre première tontine ou rejoignez-en une avec un code.
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
      paddingTop: 18,
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
    logo: {
      height: 44,
      width: 44,
    },
    marqueTexte: {
      marginLeft: 10,
    },
    nom: {
      fontSize: 20,
      fontWeight: '800',
      color: c.purple,
      letterSpacing: -0.3,
    },
    slogan: {
      fontSize: 11,
      color: c.textFaint,
    },
    cloche: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: 4,
      right: 4,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: c.red,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeTexte: {
      color: c.onAccent,
      fontSize: 10,
      fontWeight: '700',
    },
    presse: {
      opacity: 0.8,
    },
    bonjour: {
      marginTop: 24,
      fontSize: 24,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    sousBonjour: {
      marginTop: 4,
      fontSize: 13.5,
      color: c.textMuted,
    },
    hero: {
      marginTop: 18,
      backgroundColor: c.mint,
      borderRadius: 22,
      padding: 18,
    },
    heroIcone: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: 'rgba(15,33,27,0.10)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitre: {
      marginTop: 12,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '800',
      color: c.onMint,
      letterSpacing: -0.2,
    },
    heroTexte: {
      marginTop: 6,
      fontSize: 13,
      color: 'rgba(15,33,27,0.72)',
    },
    heroActions: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 10,
    },
    heroBouton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: c.onMint,
    },
    heroBoutonTexte: {
      color: c.onAccent,
      fontSize: 13.5,
      fontWeight: '700',
    },
    heroBoutonFantome: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.55)',
    },
    heroBoutonFantomeTexte: {
      color: c.onMint,
      fontSize: 13.5,
      fontWeight: '700',
    },
    stats: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      paddingVertical: 14,
    },
    stat: {
      flex: 1,
      alignItems: 'center',
    },
    statValeur: {
      fontSize: 20,
      fontWeight: '800',
      color: c.text,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 11.5,
      color: c.textFaint,
    },
    separateur: {
      width: 1,
      height: 28,
      backgroundColor: c.border,
    },
    sectionLigne: {
      marginTop: 26,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    section: {
      fontSize: 17,
      fontWeight: '800',
      color: c.text,
    },
    voirTout: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    vide: {
      alignItems: 'center',
      paddingVertical: 34,
      paddingHorizontal: 24,
      borderRadius: 18,
      backgroundColor: c.cardMuted,
    },
    videTitre: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },
    videTexte: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
  });
