import React, { useMemo, useState } from 'react';
import {
  Image,
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
import { colors } from '../theme';
import { PrimaryButton } from '../ui/PrimaryButton';
import { formatPhoneNumber } from '../services/auth';

export default function LoginScreen() {
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
      setErreur('Entrez votre numéro pour continuer');
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
      <View pointerEvents="none" style={styles.decor}>
        <View style={styles.blobHaut} />
        <View style={styles.blobBas} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenu}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.marque}>
            <View style={styles.logoBoite}>
              <Image
                source={require('../../assets/images/njangi_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.marqueTexte}>
              <Text style={styles.nom}>Njangi</Text>
              <Text style={styles.slogan}>la tontine, sans conflit</Text>
            </View>
          </View>

          <View style={styles.entete}>
            <View style={styles.pastille}>
              <MaterialIcons name="verified-user" size={14} color={colors.purple} />
              <Text style={styles.pastilleTexte}>Connexion sécurisée</Text>
            </View>
            <Text style={styles.titre}>Bienvenue sur Njangi</Text>
            <Text style={styles.description}>
              Organisez vos tontines avec des règles claires et des preuves.
            </Text>
          </View>

          <Text style={styles.label}>Numéro de téléphone</Text>

          <View
            style={[
              styles.champ,
              focus && styles.champActif,
              erreur ? styles.champErreur : null,
            ]}
          >
            <View style={styles.indicatif}>
              <Text style={styles.drapeau}>🇨🇲</Text>
              <Text style={styles.indicatifTexte}>+237</Text>
            </View>
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
              placeholderTextColor={colors.grey}
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
            <View style={styles.ligneErreur}>
              <MaterialIcons name="error-outline" size={14} color={colors.redDark} />
              <Text style={styles.erreur}>{erreur}</Text>
            </View>
          ) : (
            <View style={styles.ligneInfo}>
              <MaterialIcons
                name="lock-outline"
                size={14}
                color={colors.greyText}
              />
              <Text style={styles.info}>
                Nous vous enverrons un code de vérification par SMS.
              </Text>
            </View>
          )}

          <PrimaryButton
            label="Recevoir le code"
            onPress={recevoirCode}
            variant="mint"
            rightIcon="arrow-forward"
            style={styles.bouton}
          />

          <View style={styles.conditions}>
            <Text style={styles.conditionsTexte}>
              En continuant, vous acceptez nos{' '}
              <Text style={styles.lien}>conditions d’utilisation</Text> et notre{' '}
              <Text style={styles.lien}>politique de confidentialité</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: { flex: 1 },
  decor: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  blobHaut: {
    position: 'absolute',
    top: -140,
    right: -110,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(123,45,139,0.07)',
  },
  blobBas: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(144,238,212,0.22)',
  },
  contenu: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 28,
  },
  marque: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBoite: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123,45,139,0.12)',
    shadowColor: colors.purple,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logo: {
    height: 42,
    width: 42,
  },
  marqueTexte: {
    marginLeft: 12,
  },
  nom: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.purple,
    letterSpacing: -0.3,
  },
  slogan: {
    fontSize: 12,
    color: colors.greyText,
  },
  entete: {
    marginTop: 44,
  },
  pastille: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: colors.lightMint,
  },
  pastilleTexte: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.purple,
  },
  titre: {
    marginTop: 16,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  label: {
    marginTop: 36,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  champ: {
    height: 58,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  champActif: {
    borderColor: colors.purple,
    backgroundColor: 'rgba(123,45,139,0.02)',
  },
  champErreur: {
    borderColor: colors.redDark,
  },
  indicatif: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  drapeau: {
    fontSize: 17,
    marginRight: 6,
  },
  indicatifTexte: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saisie: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
    paddingVertical: 0,
    letterSpacing: 0.5,
  },
  ligneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 2,
  },
  info: {
    flex: 1,
    fontSize: 12,
    color: colors.greyText,
  },
  ligneErreur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 2,
  },
  erreur: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: colors.redDark,
  },
  bouton: {
    marginTop: 28,
  },
  conditions: {
    marginTop: 'auto',
    paddingTop: 28,
  },
  conditionsTexte: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.greyText,
    textAlign: 'center',
  },
  lien: {
    color: colors.purple,
    fontWeight: '600',
  },
});
