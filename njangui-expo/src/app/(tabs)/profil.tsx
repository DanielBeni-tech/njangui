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
import { Palette, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { useAppData } from '../../store/AppData';
import { useAuth } from '../../store/Auth';
import { useNotifications } from '../../store/Notifications';
import { useToast } from '../../ui/Toast';
import { ThemeSwitch } from '../../ui/ThemeSwitch';

type InfoTileProps = {
  icone: keyof typeof MaterialIcons.glyphMap;
  titre: string;
  valeur: string;
};

export default function ProfilScreen() {
  const styles = useStyles(makeStyles);
  const { colors, scheme } = useTheme();
  const { tontines } = useAppData();
  const { signOut } = useAuth();
  const { enabled, permission, setEnabled, envoyerTest } = useNotifications();
  const toast = useToast();

  const InfoTile = ({ icone, titre, valeur }: InfoTileProps) => (
    <View style={styles.info}>
      <MaterialIcons name={icone} size={18} color={colors.textFaint} />
      <Text style={styles.infoTitre}>{titre}</Text>
      <Text style={styles.infoValeur}>{valeur}</Text>
    </View>
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
    toast(
      envoye ? 'Notification envoyée' : 'Envoi impossible',
      envoye ? 'success' : 'error',
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identite}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={38} color={colors.onMint} />
          </View>
          <View style={styles.identiteTexte}>
            <Text style={styles.nom}>Mégane Dupont</Text>
            <Text style={styles.numero}>+237 658 834 387</Text>
          </View>
        </View>

        <View style={styles.carteInfos}>
          <InfoTile
            icone="groups"
            titre="Tontines"
            valeur={String(tontines.length)}
          />
          <View style={styles.separateur} />
          <InfoTile icone="calendar-today" titre="Membre depuis" valeur="Janvier 2024" />
        </View>

        <Text style={styles.sectionTitre}>Apparence</Text>
        <View style={styles.carte}>
          <View style={styles.ligneTitre}>
            <MaterialIcons
              name={scheme === 'dark' ? 'dark-mode' : 'light-mode'}
              size={18}
              color={colors.textMuted}
            />
            <Text style={styles.ligneTitreTexte}>
              {scheme === 'dark' ? 'Sombre' : 'Clair'}
            </Text>
          </View>
          <ThemeSwitch />
        </View>

        <Text style={styles.sectionTitre}>Notifications</Text>
        <View style={styles.carte}>
          <View style={styles.ligneTitre}>
            <MaterialIcons
              name="notifications-none"
              size={18}
              color={colors.textMuted}
            />
            <View style={styles.ligneTexte}>
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
          style={({ pressed }) => [
            styles.deconnexion,
            pressed && { opacity: 0.85 },
          ]}
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
      backgroundColor: c.mint,
      alignItems: 'center',
      justifyContent: 'center',
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
    carteInfos: {
      marginTop: 22,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      paddingHorizontal: 14,
      paddingVertical: 4,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
    },
    infoTitre: {
      flex: 1,
      fontSize: 13.5,
      color: c.textMuted,
    },
    infoValeur: {
      fontSize: 13.5,
      fontWeight: '600',
      color: c.text,
    },
    separateur: {
      height: 1,
      backgroundColor: c.border,
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
    carte: {
      borderRadius: 14,
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
    ligneTexte: {
      flex: 1,
    },
    ligneTitreTexte: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: '600',
      color: c.text,
    },
    ligneSousTitre: {
      marginTop: 2,
      fontSize: 11.5,
      lineHeight: 16,
      color: c.textMuted,
    },
    test: {
      alignSelf: 'flex-start',
      paddingVertical: 6,
    },
    testTexte: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    presse: {
      opacity: 0.7,
    },
    deconnexion: {
      marginTop: 26,
      height: 50,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deconnexionTexte: {
      fontSize: 14.5,
      fontWeight: '600',
      color: c.red,
    },
  });
