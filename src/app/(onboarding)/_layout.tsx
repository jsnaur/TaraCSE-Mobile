import { Stack } from 'expo-router';

import { OnboardingDraftProvider } from '@/features/onboarding/OnboardingDraft';
import { useTheme } from '@/theme/useTheme';

export default function OnboardingLayout() {
  const { theme } = useTheme();
  return (
    <OnboardingDraftProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="done" options={{ animation: 'fade' }} />
      </Stack>
    </OnboardingDraftProvider>
  );
}
