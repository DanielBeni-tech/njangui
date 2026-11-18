import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, screenPadding } from '../../theme';
import { TontineCard } from '../../ui/TontineCard';
import { useAppData } from '../../store/AppData';

export default function TontinesScreen() {
  const { tontines } = useAppData();

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.contenu}>
        <View style={styles.entete}>
          <Text style={styles.titre}>Mes Tontines</Text>
          <Pressable
            onPress={() => router.push('/rejoindre')}
            hitSlop={8}
            style={({ pressed }) => [
              styles.rejoindre,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons
              name="group-add"
              size={22}
              color={colors.purple}
            />
            <Text style={styles.rejoindreTexte}>Rejoindre</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.liste}
          showsVerticalScrollIndicator={false}
        >
          {tontines.length === 0 ? (
            <Text style={styles.vide}>
              Aucune tontine pour l'instant{'\n'}Appuyez sur + pour en créer
              une
            </Text>
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

        <Pressable
          onPress={() => router.push('/creation')}
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        >
          <MaterialIcons name="add" size={26} color={colors.green} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contenu: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: 20,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  rejoindre: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rejoindreTexte: {
    marginLeft: 6,
    fontSize: 15,
    color: colors.purple,
  },
  liste: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  vide: {
    marginTop: 40,
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: screenPadding,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
