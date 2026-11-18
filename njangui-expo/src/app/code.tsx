import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  useWindowDimensions,
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
const GAP = 8;

export default function CodeScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    verificationId?: string;
    devCode?: string;
  }>();
  const numero = params.phoneNumber ?? '';

  // Six cases qui tiennent sur 320 px, hauteur et largeur bornées.
  const caseLargeur = Math.min(52, (width - 48 - GAP * 5) / 6);
  const caseHauteur = 60;

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

  // La première case prend le focus sans que l'utilisateur ait à viser.
  useEffect(() => {
    const minuteur = setTimeout(() => refs.current[0]?.focus(), 320);
    return () => clearTimeout(minuteur);
  }, []);

  const code = chiffres.join('');

  const valider = useCallback(
    async (valeur: string) => {
      if (valeur.length < 6) {
        setErreur('Code incomplet');
        return;
      }
      if (dernierCodeSoumis.current === valeur) return;
      dernierCodeSoumis.current = valeur;
      setChargement(true);
      setErreur(null);
      try {
        await confirmVerificationCode(verificationId ?? '', valeur);
        signIn();
        router.replace('/accueil');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Code incorrect';
        setErreur(message);
        dernierCodeSoumis.current = '';
        setChiffres(Array(6).fill(''));
        refs.current[0]?.focus();
      } finally {
        setChargement(false);
      }
    },
    [verificationId, signIn],
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
      refs.current[Math.min(brut.length, 6) - 1]?.focus();
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
      const { verificationId: nouveauId, devCode: nouveau } =
        await sendVerificationCode(numero);
      setVerificationId(nouveauId);
      setDevCode(nouveau);
      setChiffres(Array(6).fill(''));
      setErreur(null);
      dernierCodeSoumis.current = '';
      setSecondes(DUREE_RENVOI);
      toast('Nouveau code envoyé', 'success');
      refs.current[0]?.focus();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Envoi impossible', 'error');
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
        <BackHeader title="Code reçu" onPress={() => router.back()} />

        <Text style={styles.titre}>Entrez le code</Text>
        <Text style={styles.sousTitre}>Envoyé au {numero}</Text>

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
              textAlignVertical="center"
              editable={!chargement}
              selectTextOnFocus
              caretHidden
              accessibilityLabel={`Chiffre ${index + 1} du code`}
              style={[
                styles.case,
                {
                  width: caseLargeur,
                  height: caseHauteur,
                  lineHeight: caseHauteur,
                },
                // Web : supprime le contour de focus qui décale le chiffre.
                Platform.OS === 'web'
                  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
                  : null,
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
          <Text style={styles.info}>
            Le code expire dans 5 minutes.
          </Text>
        )}

        {devCode ? (
          <Text style={styles.demoCode}>Code de démonstration : {devCode}</Text>
        ) : null}

        <Pressable
          onPress={renvoyer}
          disabled={secondes > 0 || renvoiEnCours}
          hitSlop={12}
          style={({ pressed }) => [styles.renvoyer, pressed && styles.presse]}
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
          label="Valider"
          onPress={() => valider(code)}
          loading={chargement}
          variant="purple"
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
      color: c.textMuted,
    },
    cases: {
      marginTop: 26,
      flexDirection: 'row',
      gap: GAP,
    },
    case: {
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 12,
      padding: 0,
      margin: 0,
      fontSize: 23,
      fontWeight: '600',
      color: c.text,
      backgroundColor: c.cardMuted,
      textAlign: 'center',
      includeFontPadding: false,
      textAlignVertical: 'center',
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
    },
    info: {
      marginTop: 12,
      fontSize: 12.5,
      color: c.textFaint,
    },
    erreur: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.red,
    },
    demoCode: {
      marginTop: 14,
      fontSize: 12.5,
      color: c.textFaint,
      fontVariant: ['tabular-nums'],
    },
    renvoyer: {
      marginTop: 18,
      alignSelf: 'flex-start',
      paddingVertical: 6,
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
