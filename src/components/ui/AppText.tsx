import { Text, type TextProps } from 'react-native';

import { fonts, typography, type TypeVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'primary'
  | 'accent'
  | 'success'
  | 'danger'
  | 'warning'
  | 'onPrimary'
  | 'onAccent';

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  tone?: TextTone;
  /** Space Grotesk with tabular figures, for scores, timers and counts. */
  numeric?: boolean;
  weight?: 'regular' | 'medium' | 'semibold';
  align?: 'left' | 'center' | 'right';
}

export function AppText({
  variant = 'body',
  tone = 'default',
  numeric = false,
  weight,
  align,
  style,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();
  const spec = typography[variant];
  const color = {
    default: theme.onSurface,
    muted: theme.onSurfaceMuted,
    subtle: theme.onSurfaceSubtle,
    primary: theme.primary,
    accent: theme.accent,
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
    onPrimary: theme.onPrimary,
    onAccent: theme.onAccent,
  }[tone];

  const weightFamily =
    weight === 'semibold'
      ? fonts.bodySemiBold
      : weight === 'medium'
        ? fonts.bodyMedium
        : weight === 'regular'
          ? fonts.body
          : undefined;

  return (
    <Text
      maxFontSizeMultiplier={spec.maxScale}
      style={[
        spec.style,
        { color },
        weightFamily ? { fontFamily: weightFamily } : null,
        numeric ? { fontFamily: fonts.displaySemiBold, fontVariant: ['tabular-nums'] } : null,
        numeric && (variant === 'display' || variant === 'title')
          ? { fontFamily: fonts.displayBold }
          : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    />
  );
}
