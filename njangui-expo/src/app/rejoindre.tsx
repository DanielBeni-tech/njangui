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
import { colors, screenPadding } from '../theme';
import { BackHeader } from '../ui/BackHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import { useAppData } from '../store/AppData';
import { Tontine } from '../types';
import { formatMontant } from '../utils/format';

function InfoRow({ label, valeur }: { label: string; valeur: string }) {
  return (
    <View style={styles.infoLigne}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValeur}>{valeur}</Text>
    </View>
  );
}

export default function RejoindreScreen() {
  const { findTontineByCode, addMembre, notifyNouveauMembre } = useAppData();
  const toast = useToast();

  const [code, setCode] = useState('');
  const [trouvee, setTrouvee] = useState<Tontine | null>(null);

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
          <MaterialIcons name="group-add" size={80} color={colors.green} />
        </View>

        <Text style={styles.titre}>Entrez le code d'invitation</Text>
        <Text style={styles.sousTitre}>
          Demandez le code au gestionnaire{'\n'}de la tontine
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
        />

        <PrimaryButton
          label="Rechercher"
          onPress={rechercher}
          variant="purple"
          style={styles.boutonRechercher}
        />

        {trouvee ? (
          <View style={styles.resultat}>
            <Text style={styles.resultatTitre}>Tontine trouvée !</Text>

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

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contenu: {
    paddingHorizontal: screenPadding,
    paddingTop: 20,
    paddingBottom: 24,
  },
  iconeZone: {
    marginTop: 40,
    alignItems: 'center',
  },
  titre: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  sousTitre: {
    marginTop: 8,
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  saisieCode: {
    marginTop: 40,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    color: colors.text,
  },
  boutonRechercher: {
    marginTop: 16,
  },
  resultat: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 12,
    backgroundColor: colors.lightMint,
    padding: 16,
  },
  resultatTitre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.green,
    marginBottom: 12,
  },
  infoLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.grey,
  },
  infoValeur: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  boutonRejoindre: {
    marginTop: 8,
  },
});
