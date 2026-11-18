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

        <Text style={styles.titre}>Confirmez ce numéro</Text>
        <Text style={styles.sousTitre}>
          Le code arrive par SMS et reste valable 5 minutes.
        </Text>

        <View style={styles.carteNumero}>
          <Text style={styles.numero}>{numero}</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityLabel="Modifier le numéro"
            style={({ pressed }) => [styles.modifier, pressed && styles.presse]}
          >
            <MaterialIcons name="edit" size={15} color={colors.purple} />
            <Text style={styles.modifierTexte}>Modifier</Text>
          </Pressable>
        </View>

        <View style={styles.espace} />

        <PrimaryButton
          label="Recevoir le code"
          onPress={envoyerCode}
          loading={chargement}
          variant="purple"
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
      paddingTop: 18,
      paddingBottom: 28,
    },
    titre: {
      marginTop: 22,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700',
      color: c.text,
    },
    sousTitre: {
      marginTop: 8,
      fontSize: 14.5,
      lineHeight: 21,
      color: c.textMuted,
    },
    carteNumero: {
      marginTop: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.cardMuted,
    },
    numero: {
      fontSize: 17,
      fontWeight: '600',
      color: c.text,
      letterSpacing: 0.3,
    },
    modifier: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    presse: {
      opacity: 0.6,
    },
    modifierTexte: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.purple,
    },
    espace: { flex: 1, minHeight: 24 },
    note: {
      marginTop: 12,
      fontSize: 11.5,
      color: c.textFaint,
      textAlign: 'center',
    },
  });
