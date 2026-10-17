import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { radius, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const CELL = 14;
/** Cells after this many stop staggering, so a long endless run doesn't crawl in. */
const STAGGER_CAP = 30;

const cellIn = (i: number) =>
  ZoomIn.delay(200 + Math.min(i, STAGGER_CAP) * 28)
    .springify()
    .damping(springs.snappy.damping)
    .stiffness(springs.snappy.stiffness)
    .mass(springs.snappy.mass);

/**
 * One square per answered question, green or red, in the order they were answered. The
 * shape of the run reads at a glance: a strong start, a slump, a late recovery.
 */
export function AnswerStrip({ results }: { results: readonly boolean[] }) {
  const { theme } = useTheme();
  const correct = results.filter(Boolean).length;
  return (
    <View
      style={styles.strip}
      accessible
      accessibilityLabel={`${correct} right and ${results.length - correct} wrong, in order`}
    >
      {results.map((right, i) => (
        <Animated.View
          key={i}
          entering={cellIn(i)}
          style={[styles.cell, { backgroundColor: right ? theme.success : theme.danger }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cell: { width: CELL, height: CELL, borderRadius: radius.sm / 2 },
});
