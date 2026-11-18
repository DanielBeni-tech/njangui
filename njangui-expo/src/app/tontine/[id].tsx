import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, screenPadding } from '../../theme';
import { BackHeader } from '../../ui/BackHeader';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { useToast } from '../../ui/Toast';
import { useAppData } from '../../store/AppData';
import { Membre } from '../../types';
import { formatDateCourte, formatMontant } from '../../utils/format';

export default function DetailTontineScreen() {
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

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <BackHeader title={tontine.nom} onPress={() => router.back()} />

        <View style={styles.carte}>
          <Text style={styles.libelle}>Montant</Text>
          <Text style={styles.montant}>
            {formatMontant(tontine.montant)} FCFA
          </Text>
        </View>

        <View style={styles.carte}>
          <View style={styles.gestionnaireLigne}>
            <View>
              <Text style={styles.libelle}>Gestionnaire</Text>
              <Text style={styles.gestionnaire}>{tontine.gestionnaire}</Text>
            </View>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={35} color={colors.white} />
            </View>
          </View>
        </View>

        <View style={styles.carte}>
          <View style={styles.codeLigne}>
            <View>
              <Text style={styles.libelle}>Code d'invitation</Text>
              <Text style={styles.code}>{tontine.codeInvitation}</Text>
            </View>
            <Pressable onPress={copierCode} hitSlop={10}>
              <MaterialIcons
                name="content-copy"
                size={24}
                color={colors.purple}
              />
            </Pressable>
          </View>
        </View>

        <View style={[styles.carte, styles.carteCentree]}>
          <Text style={styles.membresTitre}>
            Membres ({tontine.membres.length})
          </Text>
        </View>

        {tontine.membres.map((membre) => (
          <Pressable
            key={membre.id}
            onPress={() => basculerPaiement(membre)}
            style={({ pressed }) => [styles.membre, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.membreGauche}>
              <View
                style={[
                  styles.statutIcone,
                  {
                    backgroundColor: membre.aPaye
                      ? colors.green
                      : colors.red,
                  },
                ]}
              >
                <MaterialIcons
                  name={membre.aPaye ? 'check' : 'close'}
                  size={22}
                  color={colors.white}
                />
              </View>
              <Text style={styles.membreNom}>{membre.nom}</Text>
            </View>

            {membre.aPaye ? (
              <View style={styles.badgePaye}>
                <MaterialIcons name="check" size={16} color={colors.white} />
              </View>
            ) : (
              <View style={styles.badgeRetard}>
                <Text style={styles.badgeRetardTexte}>En retard</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.barre}>
        <View>
          <Text style={styles.barreTitre}>Prochaine échéance</Text>
          <Text style={styles.barreDate}>
            le {formatDateCourte(tontine.dateDebut)}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={28} color={colors.white} />
      </View>
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
    paddingBottom: 20,
  },
  introuvable: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
  },
  introuvableTexte: {
    fontSize: 18,
    color: colors.greyText,
    textAlign: 'center',
  },
  carte: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  carteCentree: {
    alignItems: 'center',
  },
  libelle: {
    fontSize: 14,
    color: colors.grey,
  },
  montant: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
  },
  gestionnaireLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gestionnaire: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '500',
    color: colors.text,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 6,
    color: colors.green,
  },
  membresTitre: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  membre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 10,
  },
  membreGauche: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statutIcone: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membreNom: {
    marginLeft: 14,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  badgePaye: {
    padding: 6,
    borderRadius: 15,
    backgroundColor: colors.green,
  },
  badgeRetard: {
    backgroundColor: colors.redLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeRetardTexte: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.red,
  },
  barre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.barGrey,
    paddingHorizontal: screenPadding,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  barreTitre: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
  },
  barreDate: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.white,
  },
});
