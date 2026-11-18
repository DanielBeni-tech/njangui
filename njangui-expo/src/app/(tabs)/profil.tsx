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
      <MaterialIcons name={icone} size={20} color={colors.purple} />
      <View style={styles.infoTexte}>
        <Text style={styles.infoTitre}>{titre}</Text>
        <Text style={styles.infoValeur}>{valeur}</Text>
      </View>
    </View>
  );

  const etatNotifications =
    Platform.OS === 'web'
      ? 'Les notifications système demandent l’app mobile.'
      : permission === 'granted'
        ? 'Autorisées sur ce téléphone'
        : permission === 'denied'
          ? 'Refusées — activez-les dans les réglages du téléphone'
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
      envoye ? 'Notification envoyée' : 'Impossible d’envoyer la notification',
      envoye ? 'success' : 'error',
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titre}>Mon profil</Text>

        <View style={styles.avatarZone}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={64} color={colors.onMint} />
          </View>
          <View style={styles.boutonPhoto}>
            <MaterialIcons name="edit" size={15} color={colors.onAccent} />
          </View>
        </View>

        <Text style={styles.nom}>Mégane</Text>
        <Text style={styles.numero}>+237 658 834 387</Text>

        <View style={styles.carteInfos}>
          <InfoTile
            icone="person-outline"
            titre="Nom complet"
            valeur="Mégane Dupont"
          />
          <View style={styles.separateur} />
          <InfoTile
            icone="phone"
            titre="Téléphone"
            valeur="+237 658 834 387"
          />
          <View style={styles.separateur} />
          <InfoTile
            icone="calendar-today"
            titre="Membre depuis"
            valeur="Janvier 2024"
          />
          <View style={styles.separateur} />
          <InfoTile
            icone="groups"
            titre="Tontines actives"
            valeur={String(tontines.length)}
          />
        </View>

        <Text style={styles.sectionTitre}>Apparence</Text>
        <View style={styles.carte}>
          <View style={styles.ligneTitre}>
            <View style={styles.ligneIcone}>
              <MaterialIcons
                name={scheme === 'dark' ? 'dark-mode' : 'light-mode'}
                size={18}
                color={colors.purple}
              />
            </View>
            <View style={styles.ligneTexte}>
              <Text style={styles.ligneTitreTexte}>Thème de l’application</Text>
              <Text style={styles.ligneSousTitre}>
                {scheme === 'dark' ? 'Sombre' : 'Clair'} actuellement
              </Text>
            </View>
          </View>
          <ThemeSwitch />
        </View>

        <Text style={styles.sectionTitre}>Notifications</Text>
        <View style={styles.carte}>
          <View style={styles.ligneTitre}>
            <View style={styles.ligneIcone}>
              <MaterialIcons
                name="notifications-active"
                size={18}
                color={colors.purple}
              />
            </View>
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
              trackColor={{ false: colors.border, true: colors.mint }}
              thumbColor={enabled ? colors.green : colors.card}
              accessibilityLabel="Activer les notifications"
            />
          </View>

          <Pressable
            onPress={test}
            style={({ pressed }) => [
              styles.test,
              pressed && styles.presse,
            ]}
          >
            <MaterialIcons
              name="campaign"
              size={17}
              color={colors.purple}
            />
            <Text style={styles.testTexte}>Envoyer une notification de test</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>
          Mode démo : les alertes sont générées dans l’application, mais la
          notification s’affiche réellement sur votre téléphone.
        </Text>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [
            styles.deconnexion,
            pressed && { opacity: 0.85 },
          ]}
        >
          <MaterialIcons name="logout" size={20} color={colors.onAccent} />
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
      paddingTop: 18,
      paddingBottom: 32,
      alignItems: 'center',
    },
    titre: {
      fontSize: 24,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    avatarZone: {
      marginTop: 24,
      width: 108,
      height: 108,
    },
    avatar: {
      width: 108,
      height: 108,
      borderRadius: 54,
      backgroundColor: c.mint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boutonPhoto: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.purpleSolid,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.background,
    },
    nom: {
      marginTop: 14,
      fontSize: 21,
      fontWeight: '800',
      color: c.text,
    },
    numero: {
      marginTop: 4,
      fontSize: 14,
      color: c.textFaint,
    },
    carteInfos: {
      alignSelf: 'stretch',
      marginTop: 24,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.card,
      paddingHorizontal: 14,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 13,
    },
    infoTexte: {
      marginLeft: 14,
    },
    infoTitre: {
      fontSize: 11.5,
      color: c.textFaint,
    },
    infoValeur: {
      marginTop: 1,
      fontSize: 14.5,
      fontWeight: '600',
      color: c.text,
    },
    separateur: {
      height: 1,
      backgroundColor: c.border,
    },
    sectionTitre: {
      alignSelf: 'flex-start',
      marginTop: 26,
      marginBottom: 10,
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    carte: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.card,
      padding: 14,
      gap: 12,
    },
    ligneTitre: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ligneIcone: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: c.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ligneTexte: {
      flex: 1,
      marginLeft: 12,
    },
    ligneTitreTexte: {
      fontSize: 14,
      fontWeight: '700',
      color: c.text,
    },
    ligneSousTitre: {
      marginTop: 2,
      fontSize: 11.5,
      lineHeight: 16,
      color: c.textMuted,
    },
    test: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 11,
      borderRadius: 14,
      backgroundColor: c.purpleSoft,
    },
    testTexte: {
      fontSize: 13,
      fontWeight: '700',
      color: c.purple,
    },
    presse: {
      opacity: 0.75,
    },
    note: {
      alignSelf: 'stretch',
      marginTop: 14,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.textFaint,
    },
    deconnexion: {
      marginTop: 24,
      alignSelf: 'stretch',
      height: 54,
      borderRadius: 30,
      backgroundColor: c.redDark,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    deconnexionTexte: {
      fontSize: 15,
      fontWeight: '600',
      color: c.onAccent,
    },
  });
