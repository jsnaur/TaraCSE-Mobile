import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';

export interface CardProps {
  children: ReactNode;
  /** `surface` sits on paper with a hairline; `sunken` is a quiet well; `ink` is the navy hero. */
  tone?: 'surface' | 'sunken' | 'ink' | 'accent';
  padding?: keyof typeof spacing | 0;
  elevated?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  tone = 'surface',
  padding = 'lg',
  elevated = false,
  onPress,
  accessibilityLabel,
  style,
}: CardProps) {
  const { theme, elevation } = useTheme();
  const bg = {
    surface: theme.surface,
    sunken: theme.surfaceSunken,
    ink: theme.ink,
    accent: theme.accentTint,
  }[tone];
  const containerStyle = [
    styles.base,
    {
      backgroundColor: bg,
      borderColor: tone === 'surface' ? theme.border : 'transparent',
      padding: padding === 0 ? 0 : spacing[padding],
    },
    elevated ? elevation.level2 : null,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        pressedScale={0.985}
        style={containerStyle}
      >
        {children}
      </PressableScale>
    );
  }
  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
  },
});
