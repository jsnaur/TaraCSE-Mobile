import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { RadioDot } from '@/components/ui/RadioDot';
import { haptics } from '@/lib/haptics';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface GoalOptionProps {
  count: number;
  title: string;
  caption: string;
  selected: boolean;
  onSelect: () => void;
  showDivider: boolean;
}

/** One radio row in the daily-goal list: name and use on the left, the number on the right. */
export function GoalOption({
  count,
  title,
  caption,
  selected,
  onSelect,
  showDivider,
}: GoalOptionProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}, ${count} questions a day. ${caption}`}
      onPress={() => {
        haptics.selection();
        onSelect();
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
      ]}
    >
      <View
        style={[
          styles.inner,
          showDivider ? { borderBottomColor: theme.border } : { borderBottomWidth: 0 },
        ]}
      >
        <RadioDot selected={selected} />
        <View style={styles.text}>
          <AppText variant="body" weight="semibold">
            {title}
          </AppText>
          <AppText variant="caption" tone="muted">
            {caption}
          </AppText>
        </View>
        <AppText variant="headline" numeric tone={selected ? 'primary' : 'muted'}>
          {count}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingLeft: spacing.lg, minHeight: minTouch + spacing.lg },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  text: { flex: 1, gap: 2 },
});
