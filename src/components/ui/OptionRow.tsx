import { Pressable, StyleSheet, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { RadioDot } from './RadioDot';

export interface OptionRowProps {
  title: string;
  caption: string;
  /** Right-aligned figure, e.g. a count. */
  figure?: string;
  selected: boolean;
  onSelect: () => void;
  showDivider: boolean;
  accessibilityLabel?: string;
}

/** One radio row in a grouped single-choice list: name and use on the left, a figure on the right. */
export function OptionRow({
  title,
  caption,
  figure,
  selected,
  onSelect,
  showDivider,
  accessibilityLabel,
}: OptionRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? `${title}. ${caption}`}
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
        {figure ? (
          <AppText variant="headline" numeric tone={selected ? 'primary' : 'muted'}>
            {figure}
          </AppText>
        ) : null}
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
