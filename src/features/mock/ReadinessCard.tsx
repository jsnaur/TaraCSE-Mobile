import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PASSING_SCORE } from '@/mocks/subjects';
import { spacing } from '@/theme/tokens';

export interface ReadinessCardProps {
  /** Average of the latest mocks, or `null` before the first one. */
  percent: number | null;
  /** How many mocks the average covers. */
  basedOn: number;
}

/**
 * Readiness as a gauge with the passing mark pinned on it, so the gap to 80% is something
 * the student can see, not just read.
 */
export function ReadinessCard({ percent, basedOn }: ReadinessCardProps) {
  const value = percent ?? 0;
  const gap = PASSING_SCORE - value;
  const line =
    percent === null
      ? 'Take a mock to see where you stand.'
      : gap <= 0
        ? 'At passing level. Keep it there.'
        : `${gap} ${gap === 1 ? 'point' : 'points'} from the passing mark.`;

  return (
    <Card padding="lg">
      <View style={styles.row}>
        <ProgressRing
          value={value / 100}
          marker={PASSING_SCORE / 100}
          sweep={0.75}
          size={116}
          stroke={10}
          tone={gap <= 0 && percent !== null ? 'success' : 'accent'}
          accessibilityLabel={`Readiness ${value} percent. Passing is ${PASSING_SCORE}.`}
        >
          <NumberTicker value={value} suffix="%" variant="title" />
        </ProgressRing>
        <View style={styles.text}>
          <AppText variant="caption" tone="muted" style={styles.overline}>
            READINESS
          </AppText>
          <AppText variant="headline">{line}</AppText>
          <AppText variant="caption" tone="subtle">
            {percent === null
              ? `Passing is ${PASSING_SCORE}%.`
              : `Average of your last ${basedOn === 1 ? 'mock' : `${basedOn} mocks`}. Passing is ${PASSING_SCORE}%.`}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  text: { flex: 1, gap: spacing.xs },
  overline: { letterSpacing: 1 },
});
