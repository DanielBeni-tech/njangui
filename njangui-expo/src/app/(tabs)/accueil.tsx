import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, screenPadding } from '../../theme';
import { TontineCard } from '../../ui/TontineCard';
import { useAppData } from '../../store/AppData';

export default function AccueilScreen() {
  const { tontines } = useAppData();

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marque}>
          <Image
            source={require('../../../assets/images/njangi_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.marqueTexte}>
            <Text style={styles.nom}>Njangi</Text>
            <Text style={styles.slogan}>la tontine, sans conflit</Text>
          </View>
        </View>

        <Text style={styles.bonjour}>Bonjour Mégane</Text>

        <View style={styles.banniere}>
          <Text style={styles.banniereTexte}>
            Créez vos tontines en toute transparence, sans conflits
          </Text>
        </View>

        <Text style={styles.section}>Mes tontines</Text>

        {tontines.length === 0 ? (
          <Text style={styles.vide}>Aucune tontine pour l'instant</Text>
        ) : (
          tontines.map((tontine) => (
            <TontineCard
              key={tontine.id}
              tontine={tontine}
              onPress={() =>
                router.push({
                  pathname: '/tontine/[id]',
                  params: { id: tontine.id },
                })
              }
            />
          ))
        )}
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
    paddingBottom: 20,
  },
  marque: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 50,
    width: 50,
  },
  marqueTexte: {
    marginLeft: 10,
  },
  nom: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.purple,
  },
  slogan: {
    fontSize: 11,
    color: colors.purple,
  },
  bonjour: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  banniere: {
    marginTop: 16,
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 20,
  },
  banniereTexte: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  vide: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
  },
});
