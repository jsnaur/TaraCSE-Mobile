import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { MonthCalendar } from '@/components/ui/MonthCalendar';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { addDays, toISODate } from '@/lib/dates';
import { daysUntil, formatExamDate } from '@/lib/mastery';
import { durations, spacing } from '@/theme/tokens';

import { OnboardingStep } from './OnboardingStep';
import { useOnboardingDraft } from './OnboardingDraft';

/** How far ahead an exam date can be picked. */
const BOOKING_WINDOW_DAYS = 730;

export function ExamDateScreen() {
  const { answers, set } = useOnboardingDraft();
  const reduceMotion = useReducedMotion();
  const now = new Date();
  const min = toISODate(addDays(now, 1));
  const max = toISODate(addDays(now, BOOKING_WINDOW_DAYS));
  const date = answers.examDate;
  const days = date ? daysUntil(date) : null;

  return (
    <OnboardingStep
      step={2}
      title="When is your exam?"
      subtitle="We count down to it on Home. Pick the date on your exam notice."
      action={{
        label: 'Continue',
        disabled: !date,
        onPress: () => router.push('/daily-goal'),
      }}
      link={{
        label: "I'm not sure yet",
        onPress: () => {
          set({ examDate: null });
          router.push('/daily-goal');
        },
      }}
    >
      <Card>
        <MonthCalendar
          value={date}
          onChange={(iso) => set({ examDate: iso })}
          min={min}
          max={max}
        />
      </Card>
      {date && days !== null ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(durations.base)}
          style={styles.countdown}
          accessible
          accessibilityLabel={`${formatExamDate(date)}, ${days} ${days === 1 ? 'day' : 'days'} from today`}
          accessibilityLiveRegion="polite"
        >
          <NumberTicker value={days} variant="title" duration={durations.slow} />
          <View style={styles.countText}>
            <AppText variant="label" weight="semibold">
              {days === 1 ? 'day from today' : 'days from today'}
            </AppText>
            <AppText variant="caption" tone="muted">
              {formatExamDate(date)}
            </AppText>
          </View>
        </Animated.View>
      ) : null}
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  countText: { flex: 1 },
});
