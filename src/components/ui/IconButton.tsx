import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';

export interface IconButtonProps {
  icon: LucideIcon;
  /** Required: icon-only controls must still say what they do. */
  label: string;
  onPress?: () => void;
  variant?: 'plain' | 'tonal' | 'outline';
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon: Icon,
  label,
  onPress,
  variant = 'plain',
  selected = false,
  disabled = false,
  style,
}: IconButtonProps) {
  const { theme } = useTheme();
  const bg =
    variant === 'tonal'
      ? theme.surfaceSunken
      : variant === 'outline'
        ? theme.surface
        : 'transparent';
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      pressedScale={0.9}
      hitSlop={4}
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: variant === 'outline' ? theme.border : 'transparent',
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Icon
        size={22}
        color={selected ? theme.primary : theme.onSurface}
        strokeWidth={2}
        fill={selected ? theme.primary : 'transparent'}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: minTouch,
    height: minTouch,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
