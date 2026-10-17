import { useEffect } from 'react';
import { type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { radius as radii } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: keyof typeof radii;
}

/** A soft breathing placeholder. Static under reduce motion. */
export function Skeleton({ width = '100%', height = 16, radius = 'sm' }: SkeletonProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0.55);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(
      withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
  }, [reduceMotion, pulse]);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: radii[radius], backgroundColor: theme.surfaceSunken },
        style,
      ]}
    />
  );
}
