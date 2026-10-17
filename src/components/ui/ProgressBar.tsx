import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { radius, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  tone?: 'primary' | 'accent' | 'success' | 'danger' | 'warning';
  height?: number;
  accessibilityLabel?: string;
}

export function ProgressBar({
  value,
  tone = 'primary',
  height = 6,
  accessibilityLabel,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const fill = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, value));

  useEffect(() => {
    fill.set(reduceMotion ? clamped : withSpring(clamped, springs.gentle));
  }, [clamped, reduceMotion, fill]);

  const style = useAnimatedStyle(() => ({ width: fill.value * width }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { height, backgroundColor: theme.surfaceSunken }]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: theme[tone] }, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', borderRadius: radius.pill },
});
