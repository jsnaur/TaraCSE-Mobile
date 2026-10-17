import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/ui/Toast';
import { SessionProvider, useSession } from '@/state/session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/useTheme';

void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { status } = useSession();
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Protected guard={status === 'signedOut'}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Protected guard={status === 'onboarding'}>
          <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Protected guard={status === 'signedIn'}>
          <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Screen name="maintenance" />
        <Stack.Protected guard={__DEV__}>
          <Stack.Screen name="dev-menu" options={{ presentation: 'modal' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);

  // System fonts are an acceptable fallback if a font fails; never block on it.
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <ToastProvider>
              <RootStack />
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
