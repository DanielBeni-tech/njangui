import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { Palette, radius } from '../theme';
import { useStyles, useTheme } from '../store/Theme';
import { BackHeader } from '../ui/BackHeader';
import { DatePickerModal } from '../ui/DatePickerModal';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useToast } from '../ui/Toast';
import { useAppData } from '../store/AppData';
import { Tontine } from '../types';
import { formatDateLongue } from '../utils/format';

type Frequence = 'semaine' | 'mois';

const FREQUENCES: Array<{ id: Frequence; label: string; aide: string }> = [
  { id: 'mois', label: 'Mensuelle', aide: 'chaque mois' },
  { id: 'semaine', label: 'Hebdomadaire', aide: 'chaque semaine' },
];

export default function CreationScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { addTontine, notifyNouvelleTontine } = useAppData();
  const toast = useToast();

  const [nom, setNom] = useState('');
  const [frequence, setFrequence] = useState<Frequence>('mois');
  const [montant, setMontant] = useState('');
  const [membres, setMembres] = useState(3);
  const [dateDebut, setDateDebut] = useState(new Date());
  const [calendrier, setCalendrier] = useState(false);

  const montantNombre = Number.parseInt(montant.replace(/[^0-9]/g, ''), 10);
  const valide = nom.trim().length > 1 && !Number.isNaN(montantNombre) && montantNombre > 0;

  const creerTontine = () => {
    if (!nom.trim()) {
      toast('Donnez un nom à votre tontine', 'error');
      return;
    }
    if (Number.isNaN(montantNombre) || montantNombre <= 0) {
      toast('Indiquez un montant par membre', 'error');
      return;
    }

    const code = `NJ${String(Date.now()).slice(-5)}`;
    const libelle = FREQUENCES.find((f) => f.id === frequence)?.aide ?? 'chaque mois';

    const tontine: Tontine = {
      id: String(Date.now()),
      nom: nom.trim(),
      montant: montantNombre,
      frequence,
      prochaineEcheance: formatDateLongue(dateDebut),
      enCours: false,
      dateDebut,
      ordreReception: 'aleatoire',
      nombreMembres: membres,
      paiementsEnregistres: true,
      prevuesObligatoires: true,
      membresVoientHistorique: true,
      gestionnaire: 'Moi',
      membres: [],
      codeInvitation: code,
    };

    addTontine(tontine);
    notifyNouvelleTontine(tontine.nom);
    toast(`« ${tontine.nom} » créée — ${libelle}, ${code}`, 'success');
    router.back();
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.contenu}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackHeader title="Créer une tontine" onPress={() => router.back()} />

          <View style={styles.pastille}>
            <MaterialIcons name="group-add" size={26} color={colors.purple} />
          </View>

          <Text style={styles.titre}>Donnez un nom à votre tontine</Text>

          <TextInput
            value={nom}
            onChangeText={setNom}
            placeholder="Ex. Famille, Amis, Collègues…"
            placeholderTextColor={colors.textFaint}
            style={styles.saisieNom}
            accessibilityLabel="Nom de la tontine"
            maxLength={40}
          />

          <Text style={styles.label}>Choisissez la fréquence</Text>
          <View style={styles.frequences}>
            {FREQUENCES.map((option) => {
              const actif = frequence === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setFrequence(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: actif }}
                  style={({ pressed }) => [
                    styles.frequence,
                    actif && styles.frequenceActive,
                    pressed && !actif && styles.presse,
                  ]}
                >
                  <MaterialIcons
                    name={option.id === 'mois' ? 'calendar-month' : 'calendar-view-week'}
                    size={17}
                    color={actif ? colors.onAccent : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.frequenceTexte,
                      actif && styles.frequenceTexteActif,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Montant par membre</Text>
          <View style={styles.montantChamp}>
            <TextInput
              value={montant}
              onChangeText={(valeur) => setMontant(valeur.replace(/[^0-9]/g, ''))}
              placeholder="Ex. 10 000"
              placeholderTextColor={colors.textFaint}
              keyboardType="number-pad"
              style={styles.montantSaisie}
              accessibilityLabel="Montant par membre"
              maxLength={9}
            />
            <Text style={styles.devise}>FCFA</Text>
          </View>

          <Text style={styles.label}>Nombre de membres</Text>
          <View style={styles.compteur}>
            <Pressable
              onPress={() => setMembres((valeur) => Math.max(2, valeur - 1))}
              disabled={membres <= 2}
              accessibilityLabel="Retirer un membre"
              style={({ pressed }) => [
                styles.compteurBouton,
                membres <= 2 && styles.compteurInactif,
                pressed && styles.presse,
              ]}
            >
              <MaterialIcons name="remove" size={20} color={colors.text} />
            </Pressable>
            <Text style={styles.compteurValeur}>{membres}</Text>
            <Pressable
              onPress={() => setMembres((valeur) => Math.min(30, valeur + 1))}
              accessibilityLabel="Ajouter un membre"
              style={({ pressed }) => [
                styles.compteurBouton,
                pressed && styles.presse,
              ]}
            >
              <MaterialIcons name="add" size={20} color={colors.text} />
            </Pressable>
          </View>

          <Text style={styles.label}>Date de début</Text>
          <Pressable
            onPress={() => setCalendrier(true)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.dateChamp, pressed && styles.presse]}
          >
            <MaterialIcons name="event" size={17} color={colors.purple} />
            <Text style={styles.dateTexte}>{formatDateLongue(dateDebut)}</Text>
            <MaterialIcons name="chevron-right" size={18} color={colors.textFaint} />
          </Pressable>

          <View style={styles.note}>
            <MaterialIcons name="verified-user" size={16} color={colors.green} />
            <Text style={styles.noteTexte}>
              Règles et paiements restent visibles par tous les membres.
            </Text>
          </View>

          <PrimaryButton
            label="Créer ma tontine"
            onPress={creerTontine}
            disabled={!valide}
            variant="purple"
            rightIcon="arrow-forward"
            style={styles.bouton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={calendrier}
        value={dateDebut}
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
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 28,
    },
    pastille: {
      alignSelf: 'center',
      marginTop: 22,
      width: 62,
      height: 62,
      borderRadius: 20,
      backgroundColor: c.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titre: {
      marginTop: 16,
      marginBottom: 14,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
      color: c.text,
      textAlign: 'center',
    },
    saisieNom: {
      height: 50,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.field,
      paddingHorizontal: 14,
      fontSize: 15,
      color: c.text,
      backgroundColor: c.card,
    },
    label: {
      marginTop: 22,
      marginBottom: 10,
      fontSize: 13.5,
      fontWeight: '600',
      color: c.text,
    },
    frequences: {
      flexDirection: 'row',
      gap: 10,
    },
    frequence: {
      flex: 1,
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: radius.field,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    frequenceActive: {
      backgroundColor: c.purpleSolid,
      borderColor: c.purpleSolid,
    },
    frequenceTexte: {
      fontSize: 13.5,
      fontWeight: '600',
      color: c.textMuted,
    },
    frequenceTexteActif: {
      color: c.onAccent,
    },
    presse: {
      opacity: 0.8,
    },
    montantChamp: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.field,
      paddingHorizontal: 14,
      backgroundColor: c.card,
    },
    montantSaisie: {
      flex: 1,
      fontSize: 15,
      color: c.text,
      paddingVertical: 0,
    },
    devise: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.textMuted,
    },
    compteur: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.field,
      paddingHorizontal: 8,
      backgroundColor: c.card,
    },
    compteurBouton: {
      width: 40,
      height: 38,
      borderRadius: radius.small,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.cardMuted,
    },
    compteurInactif: {
      opacity: 0.4,
    },
    compteurValeur: {
      fontSize: 16,
      fontWeight: '600',
      color: c.text,
    },
    dateChamp: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.field,
      paddingHorizontal: 14,
      backgroundColor: c.card,
    },
    dateTexte: {
      flex: 1,
      fontSize: 14.5,
      color: c.text,
    },
    note: {
      marginTop: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: radius.field,
      backgroundColor: c.greenSoft,
    },
    noteTexte: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
      color: c.green,
    },
    bouton: {
      marginTop: 22,
    },
  });
