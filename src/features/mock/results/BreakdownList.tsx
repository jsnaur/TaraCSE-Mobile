import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { BreakdownRow } from '@/lib/mockExam';
import { PASSING_SCORE } from '@/mocks/subjects';
import { durations, spacing } from '@/theme/tokens';

export interface BreakdownListProps {
  rows: readonly BreakdownRow[];
  /** When the list starts arriving, so it lands after the score. */
  delay: number;
}

/** Where the points came from, one bar per subject or topic. */
export function BreakdownList({ rows, delay }: BreakdownListProps) {
  const reduceMotion = useReducedMotion();
  return (
    <View style={styles.list}>
      {rows.map((row, i) => {
        const pct = row.total === 0 ? 0 : Math.round((row.correct / row.total) * 100);
        return (
          <Animated.View
            key={row.key}
            entering={
              reduceMotion ? undefined : FadeInDown.delay(delay + i * 70).duration(durations.base)
            }
            style={styles.row}
            accessible
            accessibilityLabel={`${row.label}, ${row.correct} of ${row.total}, ${pct} percent`}
          >
            <View style={styles.head}>
              <AppText variant="label" weight="medium" style={styles.flex} numberOfLines={1}>
                {row.label}
              </AppText>
              <AppText variant="label" numeric tone="muted">
                {`${row.correct}/${row.total}`}
              </AppText>
              <AppText
                variant="label"
                weight="semibold"
                numeric
                tone={pct >= PASSING_SCORE ? 'success' : 'default'}
                style={styles.pct}
              >
                {`${pct}%`}
              </AppText>
            </View>
            <ProgressBar
              value={pct / 100}
              height={6}
              tone={pct >= PASSING_SCORE ? 'success' : 'accent'}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  row: { gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  flex: { flex: 1 },
  pct: { minWidth: 44, textAlign: 'right' },
});
