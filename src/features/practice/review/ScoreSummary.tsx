import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { Kot, type KotMood } from '@/components/kot/Kot';
import { getSubject, PASSING_SCORE } from '@/mocks/subjects';
import type { PracticeRun, RunScore } from '@/state/study';
import { durations, spacing } from '@/theme/tokens';

import { AnswerStrip } from './AnswerStrip';

export interface ScoreSummaryProps {
  run: PracticeRun;
  score: RunScore;
  /** Right or wrong per answered question, in order. */
  results: readonly boolean[];
}

function verdict(percent: number): { mood: KotMood; line: string } {
  if (percent >= PASSING_SCORE) return { mood: 'cheer', line: "That's passing form." };
  if (percent >= 50) return { mood: 'encourage', line: 'Getting there. Go over the misses below.' };
  return { mood: 'thinking', line: 'Worth another pass. Start with the misses.' };
}

/** Score in big numerals, KOT's reaction, and the run's right/wrong strip. */
export function ScoreSummary({ run, score, results }: ScoreSummaryProps) {
  const subject = getSubject(run.config.subjectId);
  const topics = run.config.topicIds.length;
  const { mood, line } = verdict(score.percent ?? 0);
  const total = run.config.count;
  const endedEarly = total !== null && score.answered < total;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText variant="caption" tone="muted" style={styles.overline}>
            {`${subject?.name ?? 'Practice'}  ·  ${topics} ${topics === 1 ? 'topic' : 'topics'}`.toUpperCase()}
          </AppText>
          <View style={styles.score}>
            <NumberTicker value={score.correct} variant="display" style={styles.big} delay={150} />
            <AppText variant="headline" tone="muted" numeric>
              {`of ${score.answered} right`}
            </AppText>
          </View>
          <Animated.View entering={FadeInDown.delay(500).duration(durations.base)}>
            <AppText variant="body">{line}</AppText>
            {endedEarly ? (
              <AppText variant="caption" tone="subtle">
                {`Ended after ${score.answered} of ${total} questions`}
              </AppText>
            ) : null}
          </Animated.View>
        </View>
        <Kot mood={mood} size={104} decorative />
      </View>
      <AnswerStrip results={results} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  overline: { letterSpacing: 1 },
  score: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  big: { fontSize: 56, lineHeight: 60 },
});
