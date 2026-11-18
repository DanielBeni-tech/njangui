import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { BackHeader } from '../ui/BackHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import { sendVerificationCode } from '../services/auth';

const POINTS = [
  {
    icone: 'sms' as const,
    titre: 'Réception immédiate',
    texte: 'Le code arrive par SMS, même sans connexion internet.',
  },
  {
    icone: 'timer' as const,
    titre: 'Valable 5 minutes',
    texte: 'Passé ce délai, demandez simplement un nouveau code.',
  },
  {
    icone: 'shield' as const,
    titre: 'Numéro protégé',
    texte: 'Votre numéro sert uniquement à sécuriser votre compte.',
  },
];

export default function VerificationScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber?: string }>();
  const numero = phoneNumber ?? '';
  const [chargement, setChargement] = useState(false);
  const toast = useToast();

  const envoyerCode = async () => {
    setChargement(true);
    try {
      const { verificationId, devCode } = await sendVerificationCode(numero);
      router.push({
        pathname: '/code',
        params: { phoneNumber: numero, verificationId, devCode },
      });
    } catch (erreur) {
      toast(
        erreur instanceof Error ? erreur.message : 'Erreur lors de l’envoi',
        'error',
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <View style={styles.contenu}>
        <BackHeader title="Vérification" onPress={() => router.back()} />

        <View style={styles.etapes}>
          <View style={styles.etapeActive} />
          <View style={styles.etapeInactive} />
          <Text style={styles.etapeTexte}>Étape 1 sur 2</Text>
        </View>

        <Text style={styles.titre}>Vérifions votre numéro</Text>
        <Text style={styles.sousTitre}>
          Nous allons envoyer un code à 6 chiffres pour confirmer que ce numéro
          vous appartient.
        </Text>

        <View style={styles.carteNumero}>
          <View style={styles.avatar}>
            <MaterialIcons name="smartphone" size={24} color={colors.purple} />
          </View>
          <View style={styles.numeroBloc}>
            <Text style={styles.numeroLabel}>Numéro saisi</Text>
            <Text style={styles.numero}>{numero}</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityLabel="Modifier le numéro"
            style={({ pressed }) => [styles.modifier, pressed && styles.presse]}
          >
            <MaterialIcons name="edit" size={15} color={colors.purple} />
            <Text style={styles.modifierTexte}>Modifier</Text>
          </Pressable>
        </View>

        <View style={styles.liste}>
          {POINTS.map((point) => (
            <View key={point.titre} style={styles.ligne}>
              <View style={styles.ligneIcone}>
                <MaterialIcons
                  name={point.icone}
                  size={18}
                  color={colors.green}
                />
              </View>
              <View style={styles.ligneTexte}>
                <Text style={styles.ligneTitre}>{point.titre}</Text>
                <Text style={styles.ligneSousTitre}>{point.texte}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.espace} />

        <PrimaryButton
          label="Recevoir le code"
          onPress={envoyerCode}
          loading={chargement}
          variant="mint"
          rightIcon="arrow-forward"
        />
        <Text style={styles.note}>
          Des frais SMS opérateur peuvent s’appliquer.
        </Text>
      </View>
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
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 28,
    },
    etapes: {
      marginTop: 26,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    etapeActive: {
      width: 28,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.purple,
    },
    etapeInactive: {
      width: 16,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
    },
    etapeTexte: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: '600',
      color: c.textFaint,
    },
    titre: {
      marginTop: 20,
      fontSize: 26,
      lineHeight: 33,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    sousTitre: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 22,
      color: c.textMuted,
    },
    carteNumero: {
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 18,
      backgroundColor: c.mintSoft,
      borderWidth: 1,
      borderColor: c.border,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numeroBloc: {
      flex: 1,
      marginLeft: 12,
    },
    numeroLabel: {
      fontSize: 10.5,
      fontWeight: '700',
      color: c.textFaint,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    numero: {
      marginTop: 3,
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    modifier: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.card,
    },
    presse: {
      opacity: 0.65,
    },
    modifierTexte: {
      fontSize: 12,
      fontWeight: '600',
      color: c.purple,
    },
    liste: {
      marginTop: 26,
      gap: 18,
    },
    ligne: {
      flexDirection: 'row',
    },
    ligneIcone: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor: c.greenSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ligneTexte: {
      flex: 1,
      marginLeft: 12,
    },
    ligneTitre: {
      fontSize: 14,
      fontWeight: '700',
      color: c.text,
    },
    ligneSousTitre: {
      marginTop: 2,
      fontSize: 12.5,
      lineHeight: 18,
      color: c.textFaint,
    },
    espace: { flex: 1, minHeight: 24 },
    note: {
      marginTop: 14,
      fontSize: 11,
      color: c.textFaint,
      textAlign: 'center',
    },
  });
