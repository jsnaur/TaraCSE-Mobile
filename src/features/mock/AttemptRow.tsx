import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { haptics } from '@/lib/haptics';
import { PASSING_SCORE } from '@/mocks/subjects';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import type { AttemptSummary } from './attempts';

export interface AttemptRowProps {
  attempt: AttemptSummary;
  onPress?: () => void;
  showDivider: boolean;
}

/** One past mock: what it was, when, and the score against the passing mark. */
export function AttemptRow({ attempt, onPress, showDivider }: AttemptRowProps) {
  const { theme } = useTheme();
  const passed = attempt.percent >= PASSING_SCORE;
  const label = `${attempt.title}, ${attempt.when}. ${attempt.correct} of ${attempt.total}, ${attempt.percent} percent, ${passed ? 'passing' : 'below passing'}.`;

  const body = (pressed: boolean) => (
    <View
      style={[
        styles.row,
        { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
        showDivider
          ? { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth * 2 }
          : null,
      ]}
    >
      <View style={styles.text}>
        <AppText variant="body" weight="medium" numberOfLines={1}>
          {attempt.title}
        </AppText>
        <AppText variant="caption" tone="muted" numeric>
          {`${attempt.when}  ·  ${attempt.correct}/${attempt.total}`}
        </AppText>
      </View>
      <AppText variant="headline" numeric tone={passed ? 'success' : 'default'}>
        {`${attempt.percent}%`}
      </AppText>
      {onPress ? <ChevronRight size={18} color={theme.onSurfaceSubtle} strokeWidth={2} /> : null}
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label}>
        {body(false)}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Opens the results"
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouch + spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
  },
  text: { flex: 1, gap: 2 },
});
