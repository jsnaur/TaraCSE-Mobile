import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PASSING_SCORE } from '@/mocks/subjects';
import { spacing } from '@/theme/tokens';

export interface ScoreGaugeProps {
  percent: number;
  correct: number;
  total: number;
}

/** The score draws in on a gauge, the passing mark pinned where 80% sits. */
export function ScoreGauge({ percent, correct, total }: ScoreGaugeProps) {
  const passed = percent >= PASSING_SCORE;
  return (
    <ProgressRing
      value={percent / 100}
      marker={PASSING_SCORE / 100}
      sweep={0.75}
      size={196}
      stroke={14}
      delay={250}
      tone={passed ? 'success' : 'accent'}
      accessibilityLabel={`Score ${percent} percent, ${correct} of ${total}. Passing is ${PASSING_SCORE}.`}
    >
      <View style={styles.center}>
        <NumberTicker value={percent} suffix="%" variant="display" delay={250} style={styles.big} />
        <AppText variant="label" tone="muted" numeric>
          {`${correct} of ${total} right`}
        </AppText>
      </View>
    </ProgressRing>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.xs },
  big: { fontSize: 48, lineHeight: 52 },
});
