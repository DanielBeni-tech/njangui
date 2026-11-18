import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../store/Auth';
import { AppDataProvider } from '../store/AppData';
import { ThemeProvider, useTheme } from '../store/Theme';
import { NotificationsProvider } from '../store/Notifications';
import { ToastProvider } from '../ui/Toast';

function Routes() {
  const { signedIn } = useAuth();
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
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

function ThemedApp() {
  const { scheme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AuthProvider>
        <ToastProvider>
          <NotificationsProvider>
            <AppDataProvider>
              <Routes />
            </AppDataProvider>
          </NotificationsProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
