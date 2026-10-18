import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { durations } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  /** 0 to 1. */
  value: number;
  size?: number;
  stroke?: number;
  tone?: 'primary' | 'accent' | 'success' | 'danger';
  /** Track colour when the ring sits on a dark/ink surface. */
  onInk?: boolean;
  /** Arc that leaves a gap at the bottom, like a gauge. 1 = full circle. */
  sweep?: number;
  delay?: number;
  /** 0 to 1 along the arc: a fixed tick, e.g. the passing mark the value is measured against. */
  marker?: number;
  children?: ReactNode;
  accessibilityLabel?: string;
}

/** Ring that draws in from zero on mount, then follows value changes. */
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  tone = 'accent',
  onInk = false,
  sweep = 1,
  delay = 120,
  marker,
  children,
  accessibilityLabel,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * sweep;
  const clamped = Math.min(1, Math.max(0, value));
  const progress = useSharedValue(reduceMotion ? clamped : 0);

  useEffect(() => {
    progress.set(
      reduceMotion
        ? clamped
        : withDelay(
            delay,
            withTiming(clamped, { duration: durations.reveal, easing: Easing.out(Easing.cubic) }),
          ),
    );
  }, [clamped, reduceMotion, delay, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: arc - arc * progress.value,
  }));

  // Rotate so a partial sweep is centred with its gap at the bottom.
  const rotation = 90 + (360 * (1 - sweep)) / 2;
  const trackColor = onInk ? 'rgba(255,255,255,0.14)' : theme.surfaceSunken;
  const markerAngle = marker === undefined ? null : 2 * Math.PI * sweep * marker;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: `${rotation}deg` }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme[tone]}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          animatedProps={animatedProps}
        />
        {markerAngle !== null ? (
          <Circle
            cx={size / 2 + r * Math.cos(markerAngle)}
            cy={size / 2 + r * Math.sin(markerAngle)}
            r={stroke / 2 + 1}
            fill={onInk ? theme.onInk : theme.onSurface}
            stroke={onInk ? theme.ink : theme.background}
            strokeWidth={2}
          />
        ) : null}
      </Svg>
      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
