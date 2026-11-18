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
import { colors, screenPadding } from '../../theme';
import { useAppData } from '../../store/AppData';
import { useAuth } from '../../store/Auth';

type InfoTileProps = {
  icone: keyof typeof MaterialIcons.glyphMap;
  titre: string;
  valeur: string;
};

function InfoTile({ icone, titre, valeur }: InfoTileProps) {
  return (
    <View style={styles.info}>
      <MaterialIcons name={icone} size={22} color={colors.purple} />
      <View style={styles.infoTexte}>
        <Text style={styles.infoTitre}>{titre}</Text>
        <Text style={styles.infoValeur}>{valeur}</Text>
      </View>
    </View>
  );
}

export default function ProfilScreen() {
  const { tontines } = useAppData();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titre}>Mon Profil</Text>

        <View style={styles.avatarZone}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={70} color={colors.white} />
          </View>
          <View style={styles.boutonPhoto}>
            <MaterialIcons name="edit" size={16} color={colors.white} />
          </View>
        </View>

        <Text style={styles.nom}>Mégane</Text>
        <Text style={styles.numero}>+237 658 834 387</Text>

        <View style={styles.infos}>
          <InfoTile
            icone="person-outline"
            titre="Nom complet"
            valeur="Mégane Dupont"
          />
          <InfoTile
            icone="phone"
            titre="Téléphone"
            valeur="+237 658 834 387"
          />
          <InfoTile
            icone="calendar-today"
            titre="Membre depuis"
            valeur="Janvier 2024"
          />
          <InfoTile
            icone="groups"
            titre="Tontines actives"
            valeur={String(tontines.length)}
          />
        </View>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [styles.deconnexion, pressed && { opacity: 0.85 }]}
        >
          <MaterialIcons name="logout" size={20} color={colors.white} />
          <Text style={styles.deconnexionTexte}>Se déconnecter</Text>
        </Pressable>
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
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  avatarZone: {
    marginTop: 30,
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonPhoto: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nom: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  numero: {
    marginTop: 6,
    fontSize: 16,
    color: colors.grey,
  },
  infos: {
    alignSelf: 'stretch',
    marginTop: 40,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  infoTexte: {
    marginLeft: 16,
  },
  infoTitre: {
    fontSize: 12,
    color: colors.grey,
  },
  infoValeur: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  deconnexion: {
    marginTop: 28,
    alignSelf: 'stretch',
    height: 55,
    borderRadius: 30,
    backgroundColor: '#EF5350',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deconnexionTexte: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.white,
  },
});
