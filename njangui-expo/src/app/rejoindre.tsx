import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, screenPadding } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { BackHeader } from '../ui/BackHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import { useAppData } from '../store/AppData';
import { Tontine } from '../types';
import { formatMontant } from '../utils/format';

export default function RejoindreScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { findTontineByCode, addMembre, notifyNouveauMembre } = useAppData();
  const toast = useToast();

  const [code, setCode] = useState('');
  const [trouvee, setTrouvee] = useState<Tontine | null>(null);

  const InfoRow = ({ label, valeur }: { label: string; valeur: string }) => (
    <View style={styles.infoLigne}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValeur}>{valeur}</Text>
    </View>
  );

  const rechercher = () => {
    if (!code.trim()) {
      toast("Veuillez entrer un code d'invitation");
      return;
    }
    const tontine = findTontineByCode(code);
    setTrouvee(tontine ?? null);
    if (!tontine) {
      toast('Code invalide. Aucune tontine trouvée.', 'error');
    }
  };

  const rejoindre = () => {
    if (!trouvee) return;
    addMembre(trouvee.id, {
      id: String(Date.now()),
      nom: 'Moi',
      aPaye: false,
    });
    notifyNouveauMembre('Vous', trouvee.nom);
    toast(`Vous avez rejoint "${trouvee.nom}" avec succès !`, 'success');
    router.back();
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackHeader
          title="Rejoindre une tontine"
          onPress={() => router.back()}
        />

        <View style={styles.iconeZone}>
          <MaterialIcons name="group-add" size={34} color={colors.green} />
        </View>

        <Text style={styles.titre}>Entrez le code d’invitation</Text>
        <Text style={styles.sousTitre}>
          Demandez le code au gestionnaire de la tontine. Exemple : FAM001
        </Text>

        <TextInput
          value={code}
          onChangeText={(valeur) => setCode(valeur.toUpperCase())}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="XXXXXX"
          placeholderTextColor={colors.borderStrong}
          style={styles.saisieCode}
          textAlign="center"
          maxLength={10}
          accessibilityLabel="Code d'invitation"
          onSubmitEditing={rechercher}
        />

        <PrimaryButton
          label="Rechercher"
          onPress={rechercher}
          variant="purple"
          leftIcon="search"
          style={styles.boutonRechercher}
        />

        {trouvee ? (
          <View style={styles.resultat}>
            <View style={styles.resultatEntete}>
              <View style={styles.resultatIcone}>
                <MaterialIcons
                  name="check"
                  size={16}
                  color={colors.onAccent}
                />
              </View>
              <Text style={styles.resultatTitre}>Tontine trouvée</Text>
            </View>

            <InfoRow label="Nom" valeur={trouvee.nom} />
            <InfoRow
              label="Montant"
              valeur={`${formatMontant(trouvee.montant)} FCFA/${trouvee.frequence}`}
            />
            <InfoRow label="Gestionnaire" valeur={trouvee.gestionnaire} />
            <InfoRow
              label="Membres"
              valeur={`${trouvee.membres.length}/${trouvee.nombreMembres}`}
            />

            <PrimaryButton
              label="Rejoindre cette tontine"
              onPress={rejoindre}
              variant="green"
              height={50}
              style={styles.boutonRejoindre}
            />
          </View>
        ) : null}
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
      paddingBottom: 24,
    },
    iconeZone: {
      marginTop: 34,
      alignSelf: 'center',
      width: 76,
      height: 76,
      borderRadius: 26,
      backgroundColor: c.greenSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titre: {
      marginTop: 18,
      fontSize: 21,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    sousTitre: {
      marginTop: 8,
      fontSize: 13,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 19,
    },
    saisieCode: {
      marginTop: 26,
      borderWidth: 1.5,
      borderColor: c.borderStrong,
      borderRadius: 16,
      paddingVertical: 15,
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: 7,
      color: c.text,
      backgroundColor: c.card,
    },
    boutonRechercher: {
      marginTop: 16,
    },
    resultat: {
      marginTop: 24,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.backgroundAlt,
      padding: 16,
    },
    resultatEntete: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    resultatIcone: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: c.greenSolid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultatTitre: {
      fontSize: 13,
      fontWeight: '800',
      color: c.green,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoLigne: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    infoLabel: {
      fontSize: 13,
      color: c.textMuted,
    },
    infoValeur: {
      fontSize: 13.5,
      fontWeight: '700',
      color: c.text,
    },
    boutonRejoindre: {
      marginTop: 14,
    },
  });
