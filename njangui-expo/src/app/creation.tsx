import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, screenPadding } from '../theme';
import { BackHeader } from '../ui/BackHeader';
import { CheckboxRow } from '../ui/CheckboxRow';
import { DatePickerModal } from '../ui/DatePickerModal';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import { useAppData } from '../store/AppData';
import { OrdreReception, Tontine } from '../types';
import { formatDateLongue } from '../utils/format';

type RadioRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function RadioRow({ label, selected, onPress }: RadioRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.radioLigne}>
      <View style={[styles.radio, selected && styles.radioActif]}>
        {selected ? <View style={styles.radioPoint} /> : null}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

export default function CreationScreen() {
  const { addTontine, notifyNouvelleTontine } = useAppData();
  const toast = useToast();

  const [dateDebut, setDateDebut] = useState(new Date());
  const [calendrier, setCalendrier] = useState(false);
  const [ordre, setOrdre] = useState<OrdreReception>('aleatoire');
  const [nombreMembres, setNombreMembres] = useState('');
  const [paiementsEnregistres, setPaiementsEnregistres] = useState(true);
  const [prevuesObligatoires, setPrevuesObligatoires] = useState(true);
  const [membresVoientHistorique, setMembresVoientHistorique] =
    useState(true);

  const creerTontine = () => {
    if (!nombreMembres.trim()) {
      toast('Veuillez entrer le nombre de membres');
      return;
    }
    const nombre = Number.parseInt(nombreMembres, 10);
    if (Number.isNaN(nombre) || nombre <= 0) {
      toast('Veuillez entrer un nombre valide', 'error');
      return;
    }

    const code = `TN${String(Date.now()).slice(-6)}`;

    const tontine: Tontine = {
      id: String(Date.now()),
      nom: 'Nouvelle tontine',
      montant: 0,
      frequence: 'mois',
      prochaineEcheance: formatDateLongue(dateDebut),
      enCours: false,
      dateDebut,
      ordreReception: ordre,
      nombreMembres: nombre,
      paiementsEnregistres,
      prevuesObligatoires,
      membresVoientHistorique,
      gestionnaire: 'Moi',
      membres: [],
      codeInvitation: code,
    };

    addTontine(tontine);
    notifyNouvelleTontine(tontine.nom);
    toast(`Tontine créée ! Code : ${code}`, 'success');
    router.back();
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contenu}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackHeader
          title="Règles de la tontine"
          onPress={() => router.back()}
        />

        <Pressable
          onPress={() => setCalendrier(true)}
          style={({ pressed }) => [styles.champCarte, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.libelle}>Date de début</Text>
          <Text style={styles.valeur}>{formatDateLongue(dateDebut)}</Text>
        </Pressable>

        <View style={styles.champCarte}>
          <Text style={styles.libelle}>Ordre de réception</Text>
          <View style={styles.radios}>
            <RadioRow
              label="Tirage aléatoire"
              selected={ordre === 'aleatoire'}
              onPress={() => setOrdre('aleatoire')}
            />
            <RadioRow
              label="Ordre défini"
              selected={ordre === 'defini'}
              onPress={() => setOrdre('defini')}
            />
          </View>
        </View>

        <View style={styles.champNombre}>
          <TextInput
            value={nombreMembres}
            onChangeText={setNombreMembres}
            keyboardType="number-pad"
            placeholder="Nombre de membres"
            placeholderTextColor={colors.grey}
            style={styles.saisieNombre}
            textAlign="center"
          />
        </View>

        <CheckboxRow
          label="Tous les paiements sont enregistrés"
          value={paiementsEnregistres}
          onToggle={setPaiementsEnregistres}
        />
        <CheckboxRow
          label="Les prévues sont obligatoires"
          value={prevuesObligatoires}
          onToggle={setPrevuesObligatoires}
        />
        <CheckboxRow
          label="Les membres voient l'historique"
          value={membresVoientHistorique}
          onToggle={setMembresVoientHistorique}
        />
      </ScrollView>

      <View style={styles.pied}>
        <PrimaryButton
          label="Créer la tontine"
          onPress={creerTontine}
          variant="green"
          height={60}
          rightIcon="arrow-forward"
          labelStyle={styles.boutonLabel}
        />
      </View>

      <DatePickerModal
        visible={calendrier}
        value={dateDebut}
        minimumDate={new Date()}
        title="Date de début"
        onCancel={() => setCalendrier(false)}
        onConfirm={(date) => {
          setDateDebut(date);
          setCalendrier(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: { flex: 1 },
  contenu: {
    paddingHorizontal: screenPadding,
    paddingTop: 20,
    paddingBottom: 24,
  },
  champCarte: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    padding: 16,
  },
  libelle: {
    fontSize: 14,
    color: colors.grey,
  },
  valeur: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
  },
  radios: {
    marginTop: 8,
  },
  radioLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioActif: {
    borderColor: colors.green,
  },
  radioPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text,
  },
  champNombre: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
  },
  saisieNombre: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 20,
    color: colors.text,
  },
  pied: {
    padding: 20,
  },
  boutonLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
});
