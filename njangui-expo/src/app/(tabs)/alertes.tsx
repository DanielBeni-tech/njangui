import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Palette, screenPadding } from '../../theme';
import { useStyles, useTheme } from '../../store/Theme';
import { useAppData } from '../../store/AppData';
import { NotificationModel, TypeNotification } from '../../types';
import { tempsEcoule } from '../../utils/format';

export default function AlertesScreen() {
  const styles = useStyles(makeStyles);
  const { colors } = useTheme();
  const { notifications, nonLues, marquerCommeLue, marquerToutesCommeLues } =
    useAppData();

  const META: Record<
    TypeNotification,
    { icone: keyof typeof MaterialIcons.glyphMap; couleur: string }
  > = {
    nouvelleTontine: { icone: 'group-add', couleur: colors.green },
    nouveauMembre: { icone: 'person-add', couleur: colors.purple },
    retardContribution: { icone: 'warning-amber', couleur: colors.red },
    nouveauDepot: { icone: 'payments', couleur: colors.blue },
  };

  const renderItem = ({ item }: { item: NotificationModel }) => {
    const meta = META[item.type];
    return (
      <Pressable
        onPress={() => marquerCommeLue(item.id)}
        style={({ pressed }) => [styles.ligne, pressed && styles.presse]}
      >
        <MaterialIcons name={meta.icone} size={19} color={meta.couleur} />

        <View style={styles.texteZone}>
          <View style={styles.ligneTitre}>
            <Text
              style={[styles.titre, !item.lu && styles.titreNonLu]}
              numberOfLines={1}
            >
              {item.titre}
            </Text>
            <Text style={styles.temps}>{tempsEcoule(item.date)}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>

        {!item.lu ? <View style={styles.point} /> : null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.entete}>
        <Text style={styles.titreEcran}>Alertes</Text>
        {nonLues > 0 ? (
          <Pressable
            onPress={marquerToutesCommeLues}
            hitSlop={10}
            style={({ pressed }) => pressed && styles.presse}
          >
            <Text style={styles.toutLire}>Tout lire</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separateur} />}
        ListEmptyComponent={
          <View style={styles.vide}>
            <MaterialIcons
              name="notifications-none"
              size={40}
              color={colors.textFaint}
            />
            <Text style={styles.videTitre}>Rien pour l’instant</Text>
            <Text style={styles.videTexte}>
              Dépôts, retards et nouveaux membres s’afficheront ici.
            </Text>
          </View>
        }
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
    entete: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: screenPadding,
      paddingTop: 20,
    },
    titreEcran: {
      fontSize: 23,
      fontWeight: '700',
      color: c.text,
    },
    toutLire: {
      fontSize: 13,
      fontWeight: '600',
      color: c.purple,
    },
    presse: {
      opacity: 0.7,
    },
    liste: {
      paddingHorizontal: screenPadding,
      paddingTop: 8,
      paddingBottom: 24,
      flexGrow: 1,
    },
    ligne: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingVertical: 14,
    },
    separateur: {
      height: 1,
      backgroundColor: c.border,
    },
    texteZone: {
      flex: 1,
    },
    ligneTitre: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titre: {
      flex: 1,
      fontSize: 14.5,
      color: c.text,
      marginRight: 8,
    },
    titreNonLu: {
      fontWeight: '600',
    },
    temps: {
      fontSize: 11.5,
      color: c.textFaint,
    },
    message: {
      marginTop: 3,
      fontSize: 12.5,
      lineHeight: 18,
      color: c.textMuted,
    },
    point: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: c.purple,
      marginTop: 7,
    },
    vide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingHorizontal: 30,
    },
    videTitre: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
    },
    videTexte: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
  });
