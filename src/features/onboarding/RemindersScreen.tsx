import { router } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { SwitchRow } from '@/components/ui/SwitchRow';
import type { Profile } from '@/types/user';

import { OnboardingStep } from './OnboardingStep';
import { useOnboardingDraft } from './OnboardingDraft';

type Key = keyof Profile['notifications'];

const ROWS: { key: Key; title: string; subtitle: string }[] = [
  {
    key: 'dailyReminder',
    title: 'Daily reminder',
    subtitle: "An evening nudge if you haven't studied yet",
  },
  { key: 'streakAlerts', title: 'Streak alerts', subtitle: 'A heads-up before your streak resets' },
  { key: 'duelInvites', title: 'Duel invites', subtitle: 'When someone challenges you to a duel' },
];

export function RemindersScreen() {
  const { answers, set } = useOnboardingDraft();
  const anyOn = Object.values(answers.notifications).some(Boolean);

  return (
    <OnboardingStep
      step={4}
      title="Want a nudge?"
      subtitle="Reminders can help you keep a streak. Turn on only what helps you."
      action={{
        label: anyOn ? 'Continue' : 'Continue without reminders',
        onPress: () => router.push('/done'),
      }}
    >
      <Card padding={0}>
        {ROWS.map((row, i) => (
          <SwitchRow
            key={row.key}
            title={row.title}
            subtitle={row.subtitle}
            value={answers.notifications[row.key]}
            onValueChange={(on) =>
              set({ notifications: { ...answers.notifications, [row.key]: on } })
            }
            showDivider={i < ROWS.length - 1}
          />
        ))}
      </Card>
    </OnboardingStep>
  );
}
