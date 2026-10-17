import { useEffect, useState } from 'react';
import {
  Easing,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { durations } from '@/theme/tokens';

import { AppText, type AppTextProps } from './AppText';

export interface NumberTickerProps extends Omit<AppTextProps, 'children' | 'numeric'> {
  value: number;
  /** Rendered after the number, e.g. "%". */
  suffix?: string;
  delay?: number;
  duration?: number;
}

/** Counts up from zero to `value` with tabular figures so the width never jitters. */
export function NumberTicker({
  value,
  suffix = '',
  delay = 0,
  duration = durations.reveal,
  ...textProps
}: NumberTickerProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(reduceMotion ? value : 0);
  const progress = useSharedValue(reduceMotion ? value : 0);

  useEffect(() => {
    progress.set(
      reduceMotion
        ? value
        : withDelay(delay, withTiming(value, { duration, easing: Easing.out(Easing.cubic) })),
    );
  }, [value, reduceMotion, delay, duration, progress]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setShown, current);
    },
  );

  return (
    <AppText
      numeric
      accessibilityLabel={`${value}${suffix}`}
      {...textProps}
    >{`${shown}${suffix}`}</AppText>
  );
}
