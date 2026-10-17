import { Stack } from 'expo-router';

import { useTheme } from '@/theme/useTheme';

/** Signed-in area. Tabs at the root; focused flows push over them without the bar. */
export default function AppLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="practice/session/[id]"
        options={{ gestureEnabled: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="mock/exam/[id]"
        options={{ gestureEnabled: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="duel/match/[id]" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="duel/matching" options={{ animation: 'fade' }} />
      <Stack.Screen
        name="mock/results/[id]"
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      <Stack.Screen
        name="duel/result/[id]"
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
    </Stack>
  );
}
