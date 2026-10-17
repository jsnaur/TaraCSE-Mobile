import { Check, type LucideIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { haptics } from '@/lib/haptics';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

/** Filter or choice chip. Selected chips fill with ink and gain a check. */
export function Chip({
  label,
  selected = false,
  onPress,
  icon: Icon,
  disabled = false,
}: ChipProps) {
  const { theme, isDark } = useTheme();
  const bg = selected ? (isDark ? theme.primary : theme.onSurface) : theme.surface;
  const fg = selected ? (isDark ? theme.onPrimary : theme.surface) : theme.onSurface;
  const Glyph = selected ? Check : Icon;

  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      pressedScale={0.95}
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          borderColor: selected ? bg : theme.borderStrong,
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      {Glyph ? <Glyph size={16} color={fg} strokeWidth={2.4} /> : null}
      <AppText variant="label" weight="medium" style={{ color: fg }} numberOfLines={1}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: 40,
    paddingHorizontal: spacing.lg - 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
