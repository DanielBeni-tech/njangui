import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { PrimaryButton } from '../ui/PrimaryButton';
import { formatPhoneNumber } from '../services/auth';

export default function ConnexionScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const [telephone, setTelephone] = useState('');
  const [focus, setFocus] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const chiffres = useMemo(
    () => telephone.replace(/[^0-9]/g, ''),
    [telephone],
  );
  const valide = chiffres.length >= 8 && chiffres.length <= 9;

  const recevoirCode = () => {
    if (!chiffres) {
      setErreur('Entrez votre numéro');
      return;
    }
    if (!valide) {
      setErreur('Numéro incomplet — 9 chiffres attendus');
      return;
    }
    setErreur(null);
    router.push({
      pathname: '/verification',
      params: { phoneNumber: formatPhoneNumber(telephone) },
    });
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenu}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.entete}>
            <Text
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Retour à la couverture"
              style={styles.retour}
            >
              <MaterialIcons name="chevron-left" size={30} color={colors.text} />
            </Text>
          </View>

          <Text style={styles.titre}>Votre numéro</Text>
          <Text style={styles.appui}>
            Nous vous enverrons un code à 6 chiffres.
          </Text>

          <View
            style={[
              styles.champ,
              focus && styles.champActif,
              erreur ? styles.champErreur : null,
            ]}
          >
            <Text style={styles.indicatif}>+237</Text>
            <TextInput
              value={telephone}
              onChangeText={(texte) => {
                setTelephone(texte);
                if (erreur) setErreur(null);
              }}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              keyboardType="phone-pad"
              placeholder="6 90 12 34 56"
              placeholderTextColor={colors.textFaint}
              style={styles.saisie}
              returnKeyType="done"
              onSubmitEditing={recevoirCode}
              autoComplete="tel"
              textContentType="telephoneNumber"
              maxLength={17}
              accessibilityLabel="Numéro de téléphone"
            />
          </View>

          {erreur ? (
            <Text style={styles.erreur}>{erreur}</Text>
          ) : (
            <Text style={styles.info}>
              Des frais SMS opérateur peuvent s’appliquer.
            </Text>
          )}

          <PrimaryButton
            label="Recevoir le code"
            onPress={recevoirCode}
            variant="purple"
            rightIcon="arrow-forward"
            style={styles.bouton}
          />

          <Text style={styles.conditions}>
            En continuant, vous acceptez nos conditions d’utilisation et notre
            politique de confidentialité.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ecran: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: { flex: 1 },
    contenu: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 28,
    },
    entete: {
      height: 44,
      justifyContent: 'center',
    },
    retour: {
      width: 44,
      height: 44,
      justifyContent: 'center',
    },
    titre: {
      marginTop: 18,
      fontSize: 26,
      lineHeight: 32,
      fontWeight: '700',
      color: c.text,
    },
    appui: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 21,
      color: c.textMuted,
    },
    champ: {
      marginTop: 26,
      height: 56,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      backgroundColor: c.card,
    },
    champActif: {
      borderColor: c.purple,
    },
    champErreur: {
      borderColor: c.red,
    },
    indicatif: {
      fontSize: 16,
      fontWeight: '600',
      color: c.textMuted,
      marginRight: 12,
      paddingRight: 12,
      borderRightWidth: 1,
      borderRightColor: c.border,
    },
    saisie: {
      flex: 1,
      fontSize: 17,
      color: c.text,
      paddingVertical: 0,
      letterSpacing: 0.5,
    },
    info: {
      marginTop: 10,
      fontSize: 12,
      color: c.textFaint,
    },
    erreur: {
      marginTop: 10,
      fontSize: 12.5,
      fontWeight: '600',
      color: c.red,
    },
    bouton: {
      marginTop: 26,
    },
    conditions: {
      marginTop: 'auto',
      paddingTop: 24,
      fontSize: 11.5,
      lineHeight: 17,
      color: c.textFaint,
      textAlign: 'center',
    },
  });
