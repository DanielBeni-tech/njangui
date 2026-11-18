import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { BackHeader } from '../ui/BackHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import {
  confirmVerificationCode,
  sendVerificationCode,
} from '../services/auth';
import { useAuth } from '../store/Auth';

const DUREE_RENVOI = 30;

export default function CodeScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    verificationId?: string;
    devCode?: string;
  }>();
  const numero = params.phoneNumber ?? '';

  const [chiffres, setChiffres] = useState<string[]>(Array(6).fill(''));
  const [chargement, setChargement] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [devCode, setDevCode] = useState(params.devCode);
  const [verificationId, setVerificationId] = useState(params.verificationId);
  const [secondes, setSecondes] = useState(DUREE_RENVOI);
  const [renvoiEnCours, setRenvoiEnCours] = useState(false);

  const refs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);
  const dernierCodeSoumis = useRef('');
  const toast = useToast();
  const { signIn } = useAuth();

  useEffect(() => {
    if (secondes <= 0) return;
    const minuteur = setTimeout(() => setSecondes((v) => v - 1), 1000);
    return () => clearTimeout(minuteur);
  }, [secondes]);

  const code = chiffres.join('');

  const valider = useCallback(
    async (valeur: string) => {
      if (valeur.length < 6) {
        setErreur('Veuillez entrer le code complet');
        return;
      }
      if (dernierCodeSoumis.current === valeur) return;
      dernierCodeSoumis.current = valeur;
      setChargement(true);
      setErreur(null);
      try {
        await confirmVerificationCode(verificationId ?? '', valeur);
        toast('Connexion réussie !', 'success');
        signIn();
        router.replace('/accueil');
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Code incorrect, réessayez.';
        setErreur(message);
        dernierCodeSoumis.current = '';
        setChiffres(Array(6).fill(''));
        refs.current[0]?.focus();
      } finally {
        setChargement(false);
      }
    },
    [verificationId, signIn, toast],
  );

  // Validation automatique dès que les 6 chiffres sont saisis.
  useEffect(() => {
    if (code.length === 6 && !chargement) {
      valider(code);
    }
  }, [code, chargement, valider]);

  const modifier = (texte: string, index: number) => {
    const brut = texte.replace(/[^0-9]/g, '');
    if (erreur) setErreur(null);

    // Coller un code complet dans une case répartit les chiffres.
    if (brut.length > 1) {
      const suivant = Array(6).fill('');
      brut
        .slice(0, 6)
        .split('')
        .forEach((chiffre, position) => {
          suivant[position] = chiffre;
        });
      setChiffres(suivant);
      const dernier = Math.min(brut.length, 6) - 1;
      refs.current[dernier]?.focus();
      return;
    }

    const valeur = brut.slice(-1);
    setChiffres((precedent) => {
      const suivant = [...precedent];
      suivant[index] = valeur;
      return suivant;
    });
    if (valeur && index < 5) {
      refs.current[index + 1]?.focus();
    }
    if (!valeur && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const effacer = (touche: string, index: number) => {
    if (touche === 'Backspace' && !chiffres[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setChiffres((precedent) => {
        const suivant = [...precedent];
        suivant[index - 1] = '';
        return suivant;
      });
    }
  };

  const renvoyer = async () => {
    if (secondes > 0 || renvoiEnCours) return;
    setRenvoiEnCours(true);
    try {
      const { verificationId, devCode: nouveau } =
        await sendVerificationCode(numero);
      setVerificationId(verificationId);
      setDevCode(nouveau);
      setChiffres(Array(6).fill(''));
      setErreur(null);
      dernierCodeSoumis.current = '';
      setSecondes(DUREE_RENVOI);
      toast('Nouveau code envoyé', 'success');
      refs.current[0]?.focus();
    } catch (e) {
      toast(
        e instanceof Error ? e.message : 'Impossible de renvoyer le code',
        'error',
      );
    } finally {
      setRenvoiEnCours(false);
    }
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.contenu}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BackHeader title="Vérification" onPress={() => router.back()} />

        <View style={styles.etapes}>
          <View style={styles.etapeActive} />
          <View style={styles.etapeActive} />
          <Text style={styles.etapeTexte}>Étape 2 sur 2</Text>
        </View>

        <View style={styles.iconeBoite}>
          <MaterialIcons
            name="mark-email-read"
            size={28}
            color={colors.purple}
          />
        </View>

        <Text style={styles.titre}>Saisissez le code</Text>
        <Text style={styles.sousTitre}>
          Code à 6 chiffres envoyé au{' '}
          <Text style={styles.numero}>{numero}</Text>
        </Text>

        <View style={styles.cases}>
          {chiffres.map((valeur, index) => (
            <TextInput
              key={index}
              ref={(element) => {
                refs.current[index] = element;
              }}
              value={valeur}
              onChangeText={(texte) => modifier(texte, index)}
              onKeyPress={(evenement) =>
                effacer(evenement.nativeEvent.key, index)
              }
              onFocus={() => setFocus(index)}
              onBlur={() => setFocus(null)}
              maxLength={6}
              keyboardType="number-pad"
              textAlign="center"
              editable={!chargement}
              selectTextOnFocus
              accessibilityLabel={`Chiffre ${index + 1} du code`}
              style={[
                styles.case,
                focus === index && styles.caseActive,
                valeur ? styles.caseRemplie : null,
                erreur ? styles.caseErreur : null,
              ]}
            />
          ))}
        </View>

        {erreur ? (
          <View style={styles.ligneInfo}>
            <MaterialIcons name="error-outline" size={14} color={colors.red} />
            <Text style={styles.erreur}>{erreur}</Text>
          </View>
        ) : (
          <View style={styles.ligneInfo}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={colors.textFaint}
            />
            <Text style={styles.info}>
              Le code expire dans 5 minutes. Vérifiez aussi vos SMS indésirables.
            </Text>
          </View>
        )}

        {devCode ? (
          <View style={styles.demo}>
            <MaterialIcons name="science" size={16} color={colors.teal} />
            <Text style={styles.demoTexte}>
              Mode démo — votre code :{' '}
              <Text style={styles.demoCode}>{devCode}</Text>
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={renvoyer}
          disabled={secondes > 0 || renvoiEnCours}
          hitSlop={8}
          style={({ pressed }) => [
            styles.renvoyer,
            pressed && secondes === 0 && styles.presse,
          ]}
        >
          <Text
            style={[
              styles.renvoyerTexte,
              secondes > 0 && styles.renvoyerInactif,
            ]}
          >
            {secondes > 0
              ? `Renvoyer le code dans ${secondes} s`
              : 'Renvoyer le code'}
          </Text>
        </Pressable>

        <View style={styles.espace} />

        <PrimaryButton
          label="Valider le code"
          onPress={() => valider(code)}
          loading={chargement}
          variant="mint"
          rightIcon="check"
        />
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
      width: 22,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.purple,
    },
    etapeTexte: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: '600',
      color: c.textFaint,
    },
    iconeBoite: {
      marginTop: 24,
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: c.mintSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titre: {
      marginTop: 18,
      fontSize: 26,
      lineHeight: 33,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    sousTitre: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: c.textMuted,
    },
    numero: {
      fontWeight: '700',
      color: c.text,
    },
    cases: {
      marginTop: 28,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    case: {
      flex: 1,
      minWidth: 0,
      maxWidth: 52,
      height: 58,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 14,
      fontSize: 22,
      fontWeight: '700',
      color: c.text,
      paddingVertical: 0,
      backgroundColor: c.cardMuted,
    },
    caseActive: {
      borderColor: c.purple,
      backgroundColor: c.card,
    },
    caseRemplie: {
      borderColor: c.purple,
      backgroundColor: c.card,
      color: c.purple,
    },
    caseErreur: {
      borderColor: c.red,
    },
    ligneInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingHorizontal: 2,
    },
    info: {
      flex: 1,
      fontSize: 12,
      color: c.textFaint,
    },
    erreur: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      color: c.red,
    },
    demo: {
      marginTop: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.tealSoft,
    },
    demoTexte: {
      flex: 1,
      fontSize: 12.5,
      color: c.textMuted,
    },
    demoCode: {
      fontWeight: '800',
      color: c.teal,
      letterSpacing: 1,
    },
    renvoyer: {
      marginTop: 18,
      alignSelf: 'center',
      paddingVertical: 4,
    },
    presse: {
      opacity: 0.6,
    },
    renvoyerTexte: {
      fontSize: 13.5,
      fontWeight: '600',
      color: c.purple,
    },
    renvoyerInactif: {
      color: c.textFaint,
      fontWeight: '500',
    },
    espace: { flex: 1, minHeight: 20 },
  });
