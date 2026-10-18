import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { RadioDot } from '@/components/ui/RadioDot';
import { haptics } from '@/lib/haptics';
import { durations, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface LevelCardProps {
  title: string;
  summary: string;
  subjects: string[];
  selected: boolean;
  onSelect: () => void;
}

/** A large radio card. The subjects line makes the choice concrete, not abstract. */
export function LevelCard({ title, summary, subjects, selected, onSelect }: LevelCardProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const transition = {
    transitionProperty: ['backgroundColor', 'borderColor'],
    transitionDuration: reduceMotion ? 0 : durations.fast,
  } satisfies ViewStyle;

  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${summary} Subjects: ${subjects.join(', ')}`}
      pressedScale={0.98}
      onPress={() => {
        haptics.selection();
        onSelect();
      }}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: selected ? theme.primaryTint : theme.surface,
            borderColor: selected ? theme.primary : theme.border,
            ...transition,
          },
        ]}
      >
        <View style={styles.top}>
          <View style={styles.text}>
            <AppText variant="title">{title}</AppText>
            <AppText variant="label" tone="muted">
              {summary}
            </AppText>
          </View>
          <View style={styles.dot}>
            <RadioDot selected={selected} />
          </View>
        </View>
        <View style={[styles.subjects, { borderTopColor: theme.border }]}>
          <AppText variant="caption" tone="subtle" style={styles.overline}>
            SUBJECTS
          </AppText>
          <AppText variant="label">{subjects.join(', ')}</AppText>
        </View>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 2, padding: spacing.lg, gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  text: { flex: 1, gap: spacing.xs },
  dot: { marginTop: spacing.xs },
  subjects: { gap: 2, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth * 2 },
  overline: { letterSpacing: 1 },
});
