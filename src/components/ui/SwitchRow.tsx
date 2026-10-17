import { Pressable, StyleSheet, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { Toggle } from './Toggle';

export interface SwitchRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
  disabled?: boolean;
}

export function SwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  showDivider = true,
  disabled = false,
}: SwitchRowProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => {
        haptics.selection();
        onValueChange(!value);
      }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.surfaceSunken : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          showDivider ? { borderBottomColor: theme.border } : { borderBottomWidth: 0 },
        ]}
      >
        <View style={styles.text}>
          <AppText variant="body" weight="medium">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="muted">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <Toggle value={value} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingLeft: spacing.lg, minHeight: minTouch + 8 },
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
