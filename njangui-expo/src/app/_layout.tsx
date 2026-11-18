import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../store/Auth';
import { AppDataProvider } from '../store/AppData';
import { ToastProvider } from '../ui/Toast';
import { colors } from '../theme';

function Routes() {
  const { signedIn } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="code" />
      </Stack.Protected>

      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tontine/[id]" />
        <Stack.Screen name="creation" />
        <Stack.Screen name="rejoindre" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppDataProvider>
          <ToastProvider>
            <StatusBar style="dark" />
            <Routes />
          </ToastProvider>
        </AppDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
