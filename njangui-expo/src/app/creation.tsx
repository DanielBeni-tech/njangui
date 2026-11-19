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
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Palette, screenPadding } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
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
  description: string;
  selected: boolean;
  onPress: () => void;
};

export default function CreationScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
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

  const RadioRow = ({
    label,
    description,
    selected,
    onPress,
  }: RadioRowProps) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.radioLigne,
        selected && styles.radioLigneActive,
        pressed && styles.presse,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioActif]}>
        {selected ? <View style={styles.radioPoint} /> : null}
      </View>
      <View style={styles.radioTexte}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioDescription}>{description}</Text>
      </View>
    </Pressable>
  );

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

        <Text style={styles.entete}>
          Définissez les règles : elles s’appliquent automatiquement.
        </Text>

        <Pressable
          onPress={() => setCalendrier(true)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.champCarte,
            pressed && styles.presse,
          ]}
        >
          <View style={styles.champEntete}>
            <View style={styles.champIcone}>
              <MaterialIcons
                name="event"
                size={16}
                color={colors.purple}
              />
            </View>
            <Text style={styles.libelle}>Date de début</Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={colors.textFaint}
            />
          </View>
          <Text style={styles.valeur}>{formatDateLongue(dateDebut)}</Text>
        </Pressable>

        <View style={styles.champCarte}>
          <View style={styles.champEntete}>
            <View style={styles.champIcone}>
              <MaterialIcons
                name="shuffle"
                size={16}
                color={colors.purple}
              />
            </View>
            <Text style={styles.libelle}>Ordre de réception</Text>
          </View>
          <View style={styles.radios}>
            <RadioRow
              label="Tirage aléatoire"
              description="Personne ne peut prévoir son tour"
              selected={ordre === 'aleatoire'}
              onPress={() => setOrdre('aleatoire')}
            />
            <RadioRow
              label="Ordre défini"
              description="Le gestionnaire fixe l’ordre à l’avance"
              selected={ordre === 'defini'}
              onPress={() => setOrdre('defini')}
            />
          </View>
        </View>

        <View style={styles.champCarte}>
          <View style={styles.champEntete}>
            <View style={styles.champIcone}>
              <MaterialIcons name="group" size={16} color={colors.purple} />
            </View>
            <Text style={styles.libelle}>Nombre de membres</Text>
          </View>
          <TextInput
            value={nombreMembres}
            onChangeText={setNombreMembres}
            keyboardType="number-pad"
            placeholder="Ex. 8"
            placeholderTextColor={colors.textFaint}
            style={styles.saisieNombre}
            accessibilityLabel="Nombre de membres"
          />
        </View>

        <Text style={styles.sousSection}>Options</Text>

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
          label="Les membres voient l’historique"
          value={membresVoientHistorique}
          onToggle={setMembresVoientHistorique}
        />
      </ScrollView>

      <View style={styles.pied}>
        <PrimaryButton
          label="Créer la tontine"
          onPress={creerTontine}
          variant="green"
          height={58}
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

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ecran: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: { flex: 1 },
    contenu: {
      paddingHorizontal: screenPadding,
      paddingTop: 18,
      paddingBottom: 24,
    },
    entete: {
      marginTop: 14,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
    },
    champCarte: {
      marginTop: 14,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.card,
      padding: 16,
    },
    champEntete: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    champIcone: {
      width: 26,
      height: 26,
      borderRadius: 9,
      backgroundColor: c.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    libelle: {
      flex: 1,
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    valeur: {
      marginTop: 12,
      fontSize: 22,
      fontWeight: '700',
      color: c.text,
      letterSpacing: 0,
    },
    radios: {
      marginTop: 12,
      gap: 8,
    },
    radioLigne: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 11,
      backgroundColor: c.background,
    },
    radioLigneActive: {
      borderColor: c.green,
      backgroundColor: c.greenSoft,
    },
    presse: {
      opacity: 0.85,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    radioActif: {
      borderColor: c.green,
    },
    radioPoint: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: c.green,
    },
    radioTexte: {
      flex: 1,
    },
    radioLabel: {
      fontSize: 14.5,
      fontWeight: '600',
      color: c.text,
    },
    radioDescription: {
      marginTop: 2,
      fontSize: 11.5,
      color: c.textFaint,
    },
    saisieNombre: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 18,
      fontWeight: '600',
      color: c.text,
      backgroundColor: c.background,
    },
    sousSection: {
      marginTop: 22,
      marginBottom: 10,
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    pied: {
      paddingHorizontal: screenPadding,
      paddingTop: 12,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.background,
    },
    boutonLabel: {
      fontSize: 17,
      fontWeight: '700',
    },
  });
