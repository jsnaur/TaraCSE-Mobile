import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, TimerOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Kot } from '@/components/kot/Kot';
import { formatClock, mockBreakdown, mockTitle, scoreMock } from '@/lib/mockExam';
import { PASSING_SCORE } from '@/mocks/subjects';
import { useMock } from '@/state/mock';
import { durations, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { BreakdownList } from './BreakdownList';
import { ResultStats } from './ResultStats';
import { ScoreGauge } from './ScoreGauge';

/** The reveal runs in beats: gauge, then verdict, then the facts, then the breakdown. */
const BEAT = { verdict: 900, stats: 1150, breakdown: 1350 } as const;

export function MockResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs } = useMock();
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const run = id ? runs[id] : undefined;
  const done = () => router.dismissTo('/mock');
  const beat = (ms: number) =>
    reduceMotion ? undefined : FadeInDown.delay(ms).duration(durations.slow);

  if (!run || run.submittedAt === null) {
    return (
      <Screen header={<ScreenHeader back="close" onBack={done} />}>
        <EmptyState
          title="These results are gone"
          message="Results don't survive a restart yet. Your next mock will have them."
          actionLabel="Back to Mock"
          onAction={done}
        />
      </Screen>
    );
  }

  const score = scoreMock(run.questions, run.answers);
  const passed = score.percent >= PASSING_SCORE;
  const gap = PASSING_SCORE - score.percent;
  const usedSec = Math.min(run.limitSec, (run.submittedAt - run.startedAt) / 1000);
  const rows = mockBreakdown(run.config, run.questions, run.answers);

  return (
    <Screen
      header={<ScreenHeader title={mockTitle(run.config)} back="close" onBack={done} />}
      footer={
        <View style={styles.actions}>
          <Button label="Done" variant="secondary" size="lg" onPress={done} />
          <Button
            label="Review answers"
            icon={ArrowRight}
            iconPosition="trailing"
            size="lg"
            style={styles.flex}
            onPress={() => router.push({ pathname: '/mock/review/[id]', params: { id: run.id } })}
          />
        </View>
      }
    >
      <View style={styles.body}>
        <View style={styles.hero}>
          <ScoreGauge percent={score.percent} correct={score.correct} total={score.total} />
          <Animated.View entering={beat(BEAT.verdict)} style={styles.verdict}>
            <Kot
              mood={passed ? 'cheer' : gap <= 15 ? 'encourage' : 'thinking'}
              size={72}
              decorative
            />
            <View style={styles.flex}>
              <Badge
                label={passed ? 'Passing' : 'Below passing'}
                tone={passed ? 'success' : 'warning'}
              />
              <AppText variant="headline">
                {passed
                  ? 'You passed this mock.'
                  : `${gap} ${gap === 1 ? 'point' : 'points'} short of ${PASSING_SCORE}%.`}
              </AppText>
              <AppText variant="caption" tone="muted">
                {passed
                  ? 'Hold this level across a few more mocks.'
                  : 'The breakdown shows where to spend your next sessions.'}
              </AppText>
            </View>
          </Animated.View>
        </View>

        {run.timedOut ? (
          <Animated.View
            entering={beat(BEAT.verdict)}
            style={[styles.notice, { backgroundColor: theme.warningTint }]}
          >
            <TimerOff size={18} color={theme.warning} strokeWidth={2.2} />
            <AppText variant="label" style={[styles.flex, { color: theme.warning }]}>
              Time ran out, so we submitted what you had.
            </AppText>
          </Animated.View>
        ) : null}

        <Animated.View entering={beat(BEAT.stats)}>
          <ResultStats
            right={score.correct}
            wrong={score.answered - score.correct}
            blank={score.total - score.answered}
            timeUsed={formatClock(usedSec)}
          />
        </Animated.View>

        <View>
          <SectionHeader title={run.config.kind === 'focused' ? 'By topic' : 'By subject'} />
          <BreakdownList rows={rows} delay={reduceMotion ? 0 : BEAT.breakdown} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.xl, paddingTop: spacing.sm },
  hero: { alignItems: 'center', gap: spacing.lg },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, alignSelf: 'stretch' },
  flex: { flex: 1, gap: spacing.xs },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
