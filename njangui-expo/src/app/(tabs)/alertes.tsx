import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, screenPadding } from '../../theme';
import { useAppData } from '../../store/AppData';
import { NotificationModel, TypeNotification } from '../../types';
import { tempsEcoule } from '../../utils/format';

const META: Record<
  TypeNotification,
  { icone: keyof typeof MaterialIcons.glyphMap; couleur: string }
> = {
  nouvelleTontine: { icone: 'group', couleur: colors.green },
  nouveauMembre: { icone: 'person-add', couleur: colors.purple },
  retardContribution: { icone: 'warning-amber', couleur: colors.red },
  nouveauDepot: { icone: 'payment', couleur: colors.blue },
};

export default function AlertesScreen() {
  const { notifications, nonLues, marquerCommeLue, marquerToutesCommeLues } =
    useAppData();

  const renderItem = ({ item }: { item: NotificationModel }) => {
    const meta = META[item.type];
    return (
      <Pressable
        onPress={() => marquerCommeLue(item.id)}
        style={({ pressed }) => [
          styles.tuile,
          {
            backgroundColor: item.lu ? colors.white : colors.lightMint,
            borderColor: item.lu ? colors.border : colors.mint,
          },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View
          style={[styles.iconeRond, { backgroundColor: `${meta.couleur}26` }]}
        >
          <MaterialIcons name={meta.icone} size={22} color={meta.couleur} />
        </View>

        <View style={styles.texteZone}>
          <View style={styles.ligneTitre}>
            <Text
              style={[
                styles.titre,
                { fontWeight: item.lu ? 'normal' : 'bold' },
              ]}
              numberOfLines={1}
            >
              {item.titre}
            </Text>
            <Text style={styles.temps}>{tempsEcoule(item.date)}</Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>

        {!item.lu ? <View style={styles.pointRouge} /> : null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.entete}>
        <Text style={styles.titreEcran}>Notifications</Text>
        {nonLues > 0 ? (
          <Pressable onPress={marquerToutesCommeLues} hitSlop={8}>
            <Text style={styles.toutLire}>Tout lire</Text>
          </Pressable>
        ) : null}
      </View>

      {nonLues > 0 ? (
        <View style={styles.badgeZone}>
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>{nonLues} non lue(s)</Text>
          </View>
        </View>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vide}>
            <MaterialIcons
              name="notifications-none"
              size={70}
              color={colors.grey}
            />
            <Text style={styles.videTexte}>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: colors.white,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingTop: 20,
  },
  titreEcran: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  toutLire: {
    fontSize: 14,
    color: colors.purple,
  },
  badgeZone: {
    paddingHorizontal: screenPadding,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeTexte: {
    color: colors.white,
    fontSize: 13,
  },
  liste: {
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  tuile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: screenPadding,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconeRond: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texteZone: {
    flex: 1,
    marginLeft: 14,
  },
  ligneTitre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titre: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    marginRight: 8,
  },
  temps: {
    fontSize: 12,
    color: colors.grey,
  },
  message: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(0,0,0,0.54)',
  },
  pointRouge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
    marginLeft: 8,
    marginTop: 4,
  },
  vide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  videTexte: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grey,
  },
});
