import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { durations, spacing } from '@/theme/tokens';

import { GoalOption } from './GoalOption';
import { OnboardingStep } from './OnboardingStep';
import { useOnboardingDraft } from './OnboardingDraft';

const GOALS = [
  { count: 10, title: 'Light', caption: 'One short session, like on the commute' },
  { count: 20, title: 'Steady', caption: 'A couple of short sessions a day' },
  { count: 30, title: 'Serious', caption: 'A real study block most days' },
  { count: 50, title: 'All in', caption: 'For the last weeks before the exam' },
] as const;

const MAX_GOAL = Math.max(...GOALS.map((g) => g.count));

export function DailyGoalScreen() {
  const { answers, set } = useOnboardingDraft();
  const goal = answers.dailyGoal;

  return (
    <OnboardingStep
      step={3}
      title="How many questions a day?"
      subtitle="Pick a pace you can keep. Home tracks it with this ring."
      action={{ label: 'Continue', onPress: () => router.push('/notifications') }}
    >
      {/* The same amber ring Home shows, previewed at the chosen size. */}
      <View style={styles.preview}>
        <ProgressRing
          value={goal / MAX_GOAL}
          size={132}
          stroke={12}
          accessibilityLabel={`${goal} questions a day`}
        >
          <NumberTicker value={goal} variant="display" duration={durations.slow} />
          <AppText variant="caption" tone="muted">
            a day
          </AppText>
        </ProgressRing>
      </View>
      <Card padding={0}>
        <View accessibilityRole="radiogroup">
          {GOALS.map((g, i) => (
            <GoalOption
              key={g.count}
              count={g.count}
              title={g.title}
              caption={g.caption}
              selected={goal === g.count}
              onSelect={() => set({ dailyGoal: g.count })}
              showDivider={i < GOALS.length - 1}
            />
          ))}
        </View>
      </Card>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center', paddingBottom: spacing.xs },
});
