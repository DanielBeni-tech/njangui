import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Palette, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { BackHeader } from '../../ui/BackHeader';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { useToast } from '../../ui/Toast';
import { useAppData } from '../../store/AppData';
import { Membre } from '../../types';
import { formatDateCourte, formatMontant } from '../../utils/format';

export default function DetailTontineScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    findTontineById,
    setMembrePaiement,
    notifyNouveauDepot,
    notifyRetard,
  } = useAppData();
  const toast = useToast();

  const tontine = findTontineById(id ?? '');

  if (!tontine) {
    return (
      <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
        <View style={styles.introuvable}>
          <MaterialIcons
            name="search-off"
            size={44}
            color={colors.textFaint}
          />
          <Text style={styles.introuvableTexte}>Tontine introuvable</Text>
          <PrimaryButton
            label="Retour"
            onPress={() => router.back()}
            variant="purple"
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const copierCode = async () => {
    await Clipboard.setStringAsync(tontine.codeInvitation);
    toast('Code copié !', 'success');
  };

  const basculerPaiement = (membre: Membre) => {
    const nouveauStatut = !membre.aPaye;
    setMembrePaiement(tontine.id, membre.id, nouveauStatut);
    if (nouveauStatut) {
      notifyNouveauDepot(membre.nom, tontine.montant, tontine.nom);
    } else {
      notifyRetard(membre.nom, tontine.nom);
    }
    toast(
      nouveauStatut
        ? `${membre.nom} marqué comme payé`
        : `${membre.nom} marqué en retard`,
      nouveauStatut ? 'success' : 'error',
    );
  };

  const payes = tontine.membres.filter((m) => m.aPaye).length;
  const total = tontine.membres.length;
  const ratio = total === 0 ? 0 : payes / total;
  const collecte = payes * tontine.montant;

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <BackHeader title={tontine.nom} onPress={() => router.back()} />

        <View
          style={[
            styles.etatLigne,
            {
              backgroundColor: tontine.enCours
                ? colors.greenSoft
                : colors.purpleSoft,
            },
          ]}
        >
          <View
            style={[
              styles.point,
              {
                backgroundColor: tontine.enCours
                  ? colors.green
                  : colors.purple,
              },
            ]}
          />
          <Text
            style={[
              styles.etatTexte,
              { color: tontine.enCours ? colors.green : colors.purple },
            ]}
          >
            {tontine.enCours ? 'Tontine en cours' : 'Tontine à venir'}
          </Text>
        </View>

        <View style={styles.carteMontant}>
          <Text style={styles.libelle}>Cotisation</Text>
          <Text style={styles.montant}>
            {formatMontant(tontine.montant)} FCFA
          </Text>
          <Text style={styles.frequence}>par {tontine.frequence}</Text>

          <View style={styles.progressionLigne}>
            <Text style={styles.progressionTexte}>
              {payes}/{total} membres ont payé
            </Text>
            <Text style={styles.progressionMontant}>
              {formatMontant(collecte)} FCFA
            </Text>
          </View>
          <View style={styles.piste}>
            <View
              style={[
                styles.pisteRemplie,
                { width: `${Math.round(ratio * 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.carteCode}>
          <View style={styles.codeGauche}>
            <Text style={styles.libelle}>Code d’invitation</Text>
            <Text style={styles.code}>{tontine.codeInvitation}</Text>
          </View>
          <Pressable
            onPress={copierCode}
            hitSlop={10}
            accessibilityLabel="Copier le code d'invitation"
            style={({ pressed }) => [styles.copier, pressed && styles.presse]}
          >
            <MaterialIcons
              name="content-copy"
              size={18}
              color={colors.purple}
            />
            <Text style={styles.copierTexte}>Copier</Text>
          </Pressable>
        </View>

        <View style={styles.carteGestionnaire}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={24} color={colors.onMint} />
          </View>
          <View style={styles.gestionnaireTexte}>
            <Text style={styles.libelle}>Gestionnaire</Text>
            <Text style={styles.gestionnaire}>{tontine.gestionnaire}</Text>
          </View>
          <View style={styles.membresBadge}>
            <MaterialIcons name="group" size={14} color={colors.textMuted} />
            <Text style={styles.membresBadgeTexte}>{total}</Text>
          </View>
        </View>

        <View style={styles.sectionLigne}>
          <Text style={styles.section}>Membres</Text>
          <Text style={styles.sectionNote}>Appuyez pour changer le statut</Text>
        </View>

        {tontine.membres.length === 0 ? (
          <View style={styles.videMembres}>
            <Text style={styles.videMembresTexte}>
              Aucun membre pour l’instant. Partagez le code d’invitation.
            </Text>
          </View>
        ) : (
          tontine.membres.map((membre) => (
            <Pressable
              key={membre.id}
              onPress={() => basculerPaiement(membre)}
              accessibilityRole="button"
              accessibilityLabel={`${membre.nom}, ${
                membre.aPaye ? 'a payé' : 'en retard'
              }`}
              style={({ pressed }) => [
                styles.membre,
                pressed && styles.presse,
              ]}
            >
              <View
                style={[
                  styles.membreAvatar,
                  {
                    backgroundColor: membre.aPaye
                      ? colors.greenSoft
                      : colors.redSoft,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.membreInitiale,
                    {
                      color: membre.aPaye ? colors.green : colors.red,
                    },
                  ]}
                >
                  {membre.nom.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.membreTexte}>
                <Text style={styles.membreNom}>{membre.nom}</Text>
                <Text style={styles.membreSousTitre}>
                  {membre.aPaye
                    ? `${formatMontant(tontine.montant)} FCFA reçus`
                    : 'Contribution en attente'}
                </Text>
              </View>

              {membre.aPaye ? (
                <View style={styles.badgePaye}>
                  <MaterialIcons
                    name="check"
                    size={14}
                    color={colors.onAccent}
                  />
                  <Text style={styles.badgePayeTexte}>Payé</Text>
                </View>
              ) : (
                <View style={styles.badgeRetard}>
                  <Text style={styles.badgeRetardTexte}>En retard</Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>

      <View style={styles.barre}>
        <View style={styles.barreIcone}>
          <MaterialIcons
            name="event-available"
            size={20}
            color={colors.onAccent}
          />
        </View>
        <View style={styles.barreTexte}>
          <Text style={styles.barreTitre}>Prochaine échéance</Text>
          <Text style={styles.barreDate}>
            le {formatDateCourte(tontine.dateDebut)}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.onAccent}
        />
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
    flex: { flex: 1 },
    contenu: {
      paddingHorizontal: screenPadding,
      paddingTop: 18,
      paddingBottom: 20,
    },
    introuvable: {
      flex: 1,
      paddingHorizontal: screenPadding,
      alignItems: 'center',
      justifyContent: 'center',
    },
    introuvableTexte: {
      marginTop: 12,
      fontSize: 16,
      color: c.textMuted,
      textAlign: 'center',
    },
    etatLigne: {
      alignSelf: 'flex-start',
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 11,
      paddingVertical: 5,
      borderRadius: 20,
    },
    point: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    etatTexte: {
      fontSize: 11.5,
      fontWeight: '700',
    },
    carteMontant: {
      marginTop: 14,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 20,
      backgroundColor: c.card,
      padding: 18,
    },
    libelle: {
      fontSize: 11.5,
      fontWeight: '600',
      color: c.textFaint,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    montant: {
      marginTop: 6,
      fontSize: 30,
      fontWeight: '700',
      color: c.text,
      letterSpacing: 0,
    },
    frequence: {
      marginTop: 2,
      fontSize: 13,
      color: c.textMuted,
    },
    progressionLigne: {
      marginTop: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressionTexte: {
      fontSize: 12,
      color: c.textMuted,
    },
    progressionMontant: {
      fontSize: 12,
      fontWeight: '700',
      color: c.green,
    },
    piste: {
      marginTop: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.cardMuted,
      overflow: 'hidden',
    },
    pisteRemplie: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: c.mint,
    },
    carteCode: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.card,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    codeGauche: {
      flex: 1,
    },
    code: {
      marginTop: 6,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 5,
      color: c.green,
    },
    copier: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.purpleSoft,
    },
    copierTexte: {
      fontSize: 12,
      fontWeight: '700',
      color: c.purple,
    },
    presse: {
      opacity: 0.78,
    },
    carteGestionnaire: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      backgroundColor: c.card,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: c.mint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gestionnaireTexte: {
      flex: 1,
      marginLeft: 12,
    },
    gestionnaire: {
      marginTop: 3,
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    membresBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: c.cardMuted,
    },
    membresBadgeTexte: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
    },
    sectionLigne: {
      marginTop: 24,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    section: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    sectionNote: {
      fontSize: 11,
      color: c.textFaint,
    },
    videMembres: {
      padding: 18,
      borderRadius: 16,
      backgroundColor: c.cardMuted,
    },
    videMembresTexte: {
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
    membre: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      backgroundColor: c.card,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
    },
    membreAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    membreInitiale: {
      fontSize: 16,
      fontWeight: '700',
    },
    membreTexte: {
      flex: 1,
      marginLeft: 12,
    },
    membreNom: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },
    membreSousTitre: {
      marginTop: 2,
      fontSize: 11.5,
      color: c.textFaint,
    },
    badgePaye: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: c.greenSolid,
    },
    badgePayeTexte: {
      fontSize: 11.5,
      fontWeight: '700',
      color: c.onAccent,
    },
    badgeRetard: {
      backgroundColor: c.redSoft,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    badgeRetardTexte: {
      fontSize: 11.5,
      fontWeight: '700',
      color: c.red,
    },
    barre: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.text,
      paddingHorizontal: screenPadding,
      paddingVertical: 16,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    },
    barreIcone: {
      width: 38,
      height: 38,
      borderRadius: 13,
      backgroundColor: 'rgba(255,255,255,0.14)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    barreTexte: {
      flex: 1,
      marginLeft: 12,
    },
    barreTitre: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.65)',
    },
    barreDate: {
      marginTop: 2,
      fontSize: 17,
      fontWeight: '700',
      color: c.background,
    },
  });
