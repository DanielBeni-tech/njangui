import React from 'react';
import {
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
import { Logo } from '../../ui/Logo';
import { TontineCard } from '../../ui/TontineCard';
import { useAppData } from '../../store/AppData';

type ActionRapideProps = {
  icone: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  principal?: boolean;
};

export default function AccueilScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { tontines, nonLues } = useAppData();

  const membres = tontines.reduce((total, t) => total + t.membres.length, 0);
  const enCours = tontines.filter((t) => t.enCours).length;

  const ActionRapide = ({
    icone,
    label,
    onPress,
    principal = false,
  }: ActionRapideProps) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.action,
        principal && styles.actionPrincipale,
        pressed && styles.presse,
      ]}
    >
      <MaterialIcons
        name={icone}
        size={19}
        color={principal ? colors.onAccent : colors.text}
      />
      <Text
        style={[
          styles.actionTexte,
          principal && styles.actionTextePrincipale,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.entete}>
          <Logo size={30} withName nameSize={14} />

          <Pressable
            onPress={() => router.push('/alertes')}
            accessibilityLabel="Voir les alertes"
            hitSlop={8}
            style={({ pressed }) => [styles.cloche, pressed && styles.presse]}
          >
            <MaterialIcons
              name={nonLues > 0 ? 'notifications' : 'notifications-none'}
              size={20}
              color={colors.text}
            />
            {nonLues > 0 ? <View style={styles.badge} /> : null}
          </Pressable>
        </View>

        <Text style={styles.bonjour}>Bonjour Mégane</Text>

        <View style={styles.actions}>
          <ActionRapide
            icone="add"
            label="Créer"
            principal
            onPress={() => router.push('/creation')}
          />
          <ActionRapide
            icone="group-add"
            label="Rejoindre"
            onPress={() => router.push('/rejoindre')}
          />
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
            <Pressable onPress={() => router.push('/tontines')} hitSlop={10}>
              <Text style={styles.voirTout}>Tout voir</Text>
            </Pressable>
          ) : null}
        </View>

        {tontines.length === 0 ? (
          <View style={styles.vide}>
            <MaterialIcons
              name="groups"
              size={34}
              color={colors.textFaint}
            />
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
    cloche: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: 10,
      right: 11,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.red,
    },
    presse: {
      opacity: 0.75,
    },
    bonjour: {
      marginTop: 26,
      fontSize: 23,
      fontWeight: '700',
      color: c.text,
    },
    actions: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 10,
    },
    action: {
      flex: 1,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    actionPrincipale: {
      backgroundColor: c.purpleSolid,
      borderColor: c.purpleSolid,
    },
    actionTexte: {
      fontSize: 14.5,
      fontWeight: '600',
      color: c.text,
    },
    actionTextePrincipale: {
      color: c.onAccent,
    },
    stats: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.backgroundAlt,
      borderRadius: 14,
      paddingVertical: 13,
    },
    stat: {
      flex: 1,
      alignItems: 'center',
    },
    statValeur: {
      fontSize: 19,
      fontWeight: '700',
      color: c.text,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 11.5,
      color: c.textFaint,
    },
    separateur: {
      width: 1,
      height: 26,
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
      fontSize: 16.5,
      fontWeight: '700',
      color: c.text,
    },
    voirTout: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    vide: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 24,
      borderRadius: 14,
      backgroundColor: c.backgroundAlt,
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
