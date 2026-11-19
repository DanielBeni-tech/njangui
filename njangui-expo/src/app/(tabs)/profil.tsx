import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, radius, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { useAppData } from '../../store/AppData';
import { useAuth } from '../../store/Auth';
import { useNotifications } from '../../store/Notifications';
import { useToast } from '../../ui/Toast';
import { ThemeSwitch } from '../../ui/ThemeSwitch';

type RowProps = {
  icone: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  valeur?: string;
};

export default function ProfilScreen() {
  const styles = useStyles(makeStyles);
  const { colors, scheme } = useTheme();
  const { tontines, nonLues } = useAppData();
  const { signOut } = useAuth();
  const { enabled, permission, setEnabled, envoyerTest } = useNotifications();
  const toast = useToast();

  const Row = ({ icone, label, onPress, valeur }: RowProps) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.presse]}
    >
      <MaterialIcons name={icone} size={19} color={colors.purple} />
      <Text style={styles.rowLabel}>{label}</Text>
      {valeur ? <Text style={styles.rowValeur}>{valeur}</Text> : null}
      <MaterialIcons name="chevron-right" size={18} color={colors.textFaint} />
    </Pressable>
  );

  const etatNotifications =
    Platform.OS === 'web'
      ? 'Disponibles dans l’application mobile'
      : permission === 'granted'
        ? 'Autorisées sur ce téléphone'
        : permission === 'denied'
          ? 'Refusées — à réactiver dans les réglages'
          : permission === 'unsupported'
            ? 'Non disponibles sur cet appareil'
            : 'Autorisation en attente';

  const test = async () => {
    if (!enabled || permission !== 'granted') {
      const etat = await setEnabled(true);
      if (etat !== 'granted') {
        toast('Autorisez les notifications pour recevoir les alertes', 'error');
        return;
      }
    }
    const envoye = await envoyerTest();
    toast(envoye ? 'Notification envoyée' : 'Envoi impossible', envoye ? 'success' : 'error');
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identite}>
          <View style={styles.avatar}>
            <Text style={styles.initiales}>MD</Text>
          </View>
          <View style={styles.identiteTexte}>
            <Text style={styles.nom}>Mégane T.</Text>
            <Text style={styles.numero}>+237 658 834 387</Text>
          </View>
        </View>

        <View style={styles.carte}>
          <Row
            icone="groups"
            label="Mes tontines"
            valeur={String(tontines.length)}
            onPress={() => router.push('/tontines')}
          />
          <View style={styles.separateur} />
          <Row
            icone="notifications"
            label="Notifications"
            valeur={nonLues > 0 ? String(nonLues) : undefined}
            onPress={() => router.push('/alertes')}
          />
          <View style={styles.separateur} />
          <Row
            icone="add-circle-outline"
            label="Créer une tontine"
            onPress={() => router.push('/creation')}
          />
          <View style={styles.separateur} />
          <Row
            icone="group-add"
            label="Rejoindre une tontine"
            onPress={() => router.push('/rejoindre')}
          />
        </View>

        <Text style={styles.sectionTitre}>Apparence</Text>
        <View style={styles.cartePleine}>
          <View style={styles.ligneTitre}>
            <MaterialIcons
              name={scheme === 'dark' ? 'dark-mode' : 'light-mode'}
              size={19}
              color={colors.purple}
            />
            <Text style={styles.ligneTitreTexte}>
              {scheme === 'dark' ? 'Thème sombre' : 'Thème clair'}
            </Text>
          </View>
          <ThemeSwitch />
        </View>

        <Text style={styles.sectionTitre}>Notifications</Text>
        <View style={styles.cartePleine}>
          <View style={styles.notifLigne}>
            <View style={styles.notifTexte}>
              <Text style={styles.ligneTitreTexte}>Alertes sur le téléphone</Text>
              <Text style={styles.ligneSousTitre}>{etatNotifications}</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={(valeur) => {
                void setEnabled(valeur).then((etat) => {
                  if (valeur && etat !== 'granted') {
                    toast(
                      'Autorisez les notifications dans les réglages du téléphone',
                      'error',
                    );
                  }
                });
              }}
              trackColor={{ false: colors.border, true: colors.greenSolid }}
              thumbColor={colors.card}
              accessibilityLabel="Activer les notifications"
            />
          </View>
          {Platform.OS !== 'web' ? (
            <Pressable
              onPress={test}
              style={({ pressed }) => [styles.test, pressed && styles.presse]}
            >
              <Text style={styles.testTexte}>Envoyer un test</Text>
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [styles.deconnexion, pressed && styles.presse]}
        >
          <Text style={styles.deconnexionTexte}>Se déconnecter</Text>
        </Pressable>
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
      paddingTop: 26,
      paddingBottom: 32,
    },
    identite: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: c.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initiales: {
      fontSize: 21,
      fontWeight: '700',
      color: c.purple,
    },
    identiteTexte: {
      marginLeft: 14,
      flex: 1,
    },
    nom: {
      fontSize: 19,
      fontWeight: '700',
      color: c.text,
    },
    numero: {
      marginTop: 3,
      fontSize: 13.5,
      color: c.textMuted,
    },
    carte: {
      marginTop: 22,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      height: 54,
    },
    rowLabel: {
      flex: 1,
      fontSize: 14.5,
      color: c.text,
    },
    rowValeur: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textMuted,
    },
    separateur: {
      height: 1,
      marginLeft: 45,
      backgroundColor: c.border,
    },
    presse: {
      opacity: 0.7,
    },
    sectionTitre: {
      marginTop: 24,
      marginBottom: 10,
      fontSize: 12,
      fontWeight: '600',
      color: c.textFaint,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    cartePleine: {
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      padding: 14,
      gap: 12,
    },
    ligneTitre: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    ligneTitreTexte: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: '600',
      color: c.text,
    },
    notifLigne: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    notifTexte: {
      flex: 1,
    },
    ligneSousTitre: {
      marginTop: 2,
      fontSize: 11.5,
      lineHeight: 16,
      color: c.textMuted,
    },
    test: {
      alignSelf: 'flex-start',
      paddingVertical: 4,
    },
    testTexte: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    deconnexion: {
      marginTop: 26,
      height: 50,
      borderRadius: radius.button,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.card,
    },
    deconnexionTexte: {
      fontSize: 14.5,
      fontWeight: '600',
      color: c.red,
    },
  });
