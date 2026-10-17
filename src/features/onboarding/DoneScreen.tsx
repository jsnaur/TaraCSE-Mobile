import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { Kot } from '@/components/kot/Kot';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { useStagger } from '@/hooks/useStagger';
import { haptics } from '@/lib/haptics';
import { daysUntil, formatExamDate, levelLabel } from '@/lib/mastery';
import { useProfile, useSession } from '@/state/session';
import { spacing, springs } from '@/theme/tokens';

import { useOnboardingDraft } from './OnboardingDraft';

export function DoneScreen() {
  const { dispatch } = useSession();
  const profile = useProfile();
  const { answers } = useOnboardingDraft();
  const reduceMotion = useReducedMotion();
  const enter = useStagger(260, 70);
  const firstName = profile.name.split(' ')[0] ?? profile.name;
  const days = answers.examDate ? daysUntil(answers.examDate) : null;

  const finish = () => {
    haptics.success();
    dispatch({ type: 'completeOnboarding', patch: answers });
  };

  return (
    <Screen
      footer={<Button label="Start reviewing" size="lg" fullWidth onPress={finish} />}
      contentStyle={styles.content}
    >
      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : ZoomIn.springify().damping(springs.bouncy.damping).stiffness(springs.bouncy.stiffness)
        }
        style={styles.kot}
      >
        <Kot mood="cheer" size={200} decorative />
      </Animated.View>
      <Animated.View entering={enter(0)} style={styles.head}>
        <AppText variant="display" align="center" accessibilityRole="header">
          {`You're all set, ${firstName}.`}
        </AppText>
        <AppText variant="body" tone="muted" align="center">
          Here is your plan. Tap any line to change it.
        </AppText>
      </Animated.View>
      <Animated.View entering={enter(1)}>
        <Card padding={0}>
          <ListRow
            title="Exam"
            value={levelLabel(answers.level)}
            onPress={() => router.dismissTo('/level')}
          />
          <ListRow
            title="Exam date"
            value={answers.examDate ? formatExamDate(answers.examDate) : 'Not set yet'}
            subtitle={
              days !== null ? `${days} ${days === 1 ? 'day' : 'days'} from today` : undefined
            }
            onPress={() => router.dismissTo('/exam-date')}
          />
          <ListRow
            title="Daily goal"
            value={`${answers.dailyGoal} questions`}
            onPress={() => router.dismissTo('/daily-goal')}
            showDivider={false}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl, paddingTop: spacing.xl },
  kot: { alignItems: 'center', marginBottom: -spacing.md },
  head: { gap: spacing.sm },
});
