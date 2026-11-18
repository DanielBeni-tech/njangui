import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppData } from '../../store/AppData';

export default function TabsLayout() {
  const { nonLues } = useAppData();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.white },
        sceneStyle: { backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen
        name="accueil"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="tontines"
        options={{
          title: 'Tontines',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="description" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertes"
        options={{
          title: 'Alertes',
          tabBarBadge: nonLues > 0 ? nonLues : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.redDark,
            color: colors.white,
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
