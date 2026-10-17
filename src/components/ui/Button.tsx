import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  loading?: boolean;
  /** Only for a sticky bottom action on a phone. Otherwise buttons size to their label. */
  fullWidth?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'leading',
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();
  const palette = {
    primary: { bg: theme.primary, fg: theme.onPrimary, border: 'transparent' },
    accent: { bg: theme.accent, fg: theme.onAccent, border: 'transparent' },
    secondary: { bg: theme.surface, fg: theme.onSurface, border: theme.borderStrong },
    ghost: { bg: 'transparent', fg: theme.primary, border: 'transparent' },
    danger: { bg: theme.danger, fg: theme.onPrimary, border: 'transparent' },
  }[variant];
  const inactive = disabled || loading;
  const height = size === 'lg' ? 56 : minTouch;

  const icon = Icon ? (
    <Icon size={size === 'lg' ? 20 : 18} color={palette.fg} strokeWidth={2.2} />
  ) : null;

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        haptics.light();
        onPress?.();
      }}
      style={[
        styles.base,
        {
          height,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingHorizontal: size === 'lg' ? spacing.xl : spacing.lg + 4,
          opacity: disabled ? 0.45 : 1,
        },
        fullWidth ? styles.full : styles.hug,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {iconPosition === 'leading' ? icon : null}
          <AppText
            variant={size === 'lg' ? 'headline' : 'label'}
            weight="semibold"
            numberOfLines={1}
            style={{ color: palette.fg }}
          >
            {label}
          </AppText>
          {iconPosition === 'trailing' ? icon : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hug: { alignSelf: 'flex-start' },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
