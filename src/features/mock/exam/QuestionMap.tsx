import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { haptics } from '@/lib/haptics';
import type { ChoiceId } from '@/types/exam';
import { minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface QuestionMapProps {
  visible: boolean;
  onClose: () => void;
  answers: readonly (ChoiceId | null)[];
  flagged: readonly boolean[];
  current: number;
  onJump: (index: number) => void;
  onSubmit: () => void;
}

const CELL = minTouch;
const GAP = spacing.sm;

/**
 * Every item at a glance: filled once answered, an amber corner once flagged, ringed where
 * the student is now. Tapping a number jumps there.
 */
export function QuestionMap({
  visible,
  onClose,
  answers,
  flagged,
  current,
  onJump,
  onSubmit,
}: QuestionMapProps) {
  const { theme, isDark } = useTheme();
  const { height } = useWindowDimensions();
  const answered = answers.filter((a) => a !== null).length;
  const flagCount = flagged.filter(Boolean).length;
  const ink = isDark ? theme.primary : theme.onSurface;
  const onInk = isDark ? theme.onPrimary : theme.surface;

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Question map">
      <View style={styles.legend}>
        <Legend swatch={ink} label={`${answered} answered`} />
        <Legend swatch={theme.surfaceSunken} label={`${answers.length - answered} blank`} />
        <Legend swatch={theme.accent} label={`${flagCount} flagged`} dot />
      </View>
      <ScrollView style={{ maxHeight: height * 0.46 }} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {answers.map((answer, i) => {
            const done = answer !== null;
            const here = i === current;
            return (
              <PressableScale
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Question ${i + 1}, ${done ? 'answered' : 'blank'}${flagged[i] ? ', flagged' : ''}${here ? ', current' : ''}`}
                pressedScale={0.9}
                onPress={() => {
                  haptics.selection();
                  onJump(i);
                }}
                style={[
                  styles.cell,
                  {
                    backgroundColor: done ? ink : theme.surfaceSunken,
                    borderColor: here ? theme.accent : 'transparent',
                  },
                ]}
              >
                <AppText
                  variant="label"
                  weight="semibold"
                  numeric
                  style={{ color: done ? onInk : theme.onSurfaceMuted }}
                >
                  {i + 1}
                </AppText>
                {flagged[i] ? (
                  <View
                    style={[
                      styles.flag,
                      { backgroundColor: theme.accent, borderColor: theme.surface },
                    ]}
                  />
                ) : null}
              </PressableScale>
            );
          })}
        </View>
      </ScrollView>
      <Button label="Submit exam" size="lg" fullWidth onPress={onSubmit} style={styles.submit} />
    </BottomSheet>
  );
}

function Legend({ swatch, label, dot = false }: { swatch: string; label: string; dot?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View style={[dot ? styles.legendDot : styles.legendSwatch, { backgroundColor: swatch }]} />
      <AppText variant="caption" tone="muted" numeric>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  legendSwatch: { width: 12, height: 12, borderRadius: 3 },
  legendDot: { width: 8, height: 8, borderRadius: radius.pill },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingVertical: spacing.xs },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  submit: { marginTop: spacing.lg },
});
