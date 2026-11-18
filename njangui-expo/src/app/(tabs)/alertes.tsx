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
    {
      icone: keyof typeof MaterialIcons.glyphMap;
      couleur: string;
      fond: string;
    }
  > = {
    nouvelleTontine: {
      icone: 'group-add',
      couleur: colors.green,
      fond: colors.greenSoft,
    },
    nouveauMembre: {
      icone: 'person-add',
      couleur: colors.purple,
      fond: colors.purpleSoft,
    },
    retardContribution: {
      icone: 'warning-amber',
      couleur: colors.red,
      fond: colors.redSoft,
    },
    nouveauDepot: {
      icone: 'payments',
      couleur: colors.blue,
      fond: colors.blueSoft,
    },
  };

  const renderItem = ({ item }: { item: NotificationModel }) => {
    const meta = META[item.type];
    return (
      <Pressable
        onPress={() => marquerCommeLue(item.id)}
        style={({ pressed }) => [
          styles.tuile,
          !item.lu && styles.tuileNonLue,
          pressed && styles.presse,
        ]}
      >
        <View style={[styles.iconeRond, { backgroundColor: meta.fond }]}>
          <MaterialIcons name={meta.icone} size={20} color={meta.couleur} />
        </View>

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

        {!item.lu ? <View style={styles.pointRouge} /> : null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <View style={styles.entete}>
        <View>
          <Text style={styles.titreEcran}>Notifications</Text>
          <Text style={styles.sousTitre}>
            {nonLues > 0 ? `${nonLues} non lue(s)` : 'Tout est à jour'}
          </Text>
        </View>
        {nonLues > 0 ? (
          <Pressable
            onPress={marquerToutesCommeLues}
            hitSlop={8}
            style={({ pressed }) => [
              styles.toutLire,
              pressed && styles.presse,
            ]}
          >
            <MaterialIcons name="done-all" size={16} color={colors.purple} />
            <Text style={styles.toutLireTexte}>Tout lire</Text>
          </Pressable>
        ) : null}
      </View>

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
              size={54}
              color={colors.textFaint}
            />
            <Text style={styles.videTitre}>Aucune notification</Text>
            <Text style={styles.videTexte}>
              Les dépôts, retards et nouveaux membres apparaîtront ici — et sur
              votre téléphone.
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
      paddingTop: 18,
    },
    titreEcran: {
      fontSize: 24,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.5,
    },
    sousTitre: {
      marginTop: 3,
      fontSize: 12.5,
      color: c.textFaint,
    },
    toutLire: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.purpleSoft,
    },
    toutLireTexte: {
      fontSize: 12.5,
      fontWeight: '700',
      color: c.purple,
    },
    presse: {
      opacity: 0.78,
    },
    liste: {
      paddingHorizontal: screenPadding,
      paddingTop: 18,
      paddingBottom: 24,
      flexGrow: 1,
    },
    tuile: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    tuileNonLue: {
      borderColor: c.purpleSoft,
      backgroundColor: c.backgroundAlt,
    },
    iconeRond: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    texteZone: {
      flex: 1,
      marginLeft: 12,
    },
    ligneTitre: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titre: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: '500',
      color: c.text,
      marginRight: 8,
    },
    titreNonLu: {
      fontWeight: '800',
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
    pointRouge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.red,
      marginLeft: 8,
      marginTop: 6,
    },
    vide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 90,
      paddingHorizontal: 30,
    },
    videTitre: {
      marginTop: 14,
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
    },
    videTexte: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: c.textMuted,
      textAlign: 'center',
    },
  });
