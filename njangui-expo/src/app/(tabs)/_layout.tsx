import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../store/Theme';
import { useAppData } from '../../store/AppData';

export const unstable_settings = {
  initialRouteName: 'accueil',
};

export default function TabsLayout() {
  const { nonLues } = useAppData();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="accueil"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'home' : 'home'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tontines"
        options={{
          title: 'Tontines',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertes"
        options={{
          title: 'Alertes',
          tabBarBadge: nonLues > 0 ? nonLues : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.red,
            color: colors.onAccent,
            fontSize: 10,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'notifications' : 'notifications-none'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
