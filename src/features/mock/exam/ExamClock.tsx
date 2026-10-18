import { Clock } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { formatClock, type ClockTone } from '@/lib/mockExam';
import { durations, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ExamClockProps {
  remainingSec: number;
  tone: ClockTone;
}

/**
 * Time left as a pill. It stays quiet until the last stretch, turns amber, then red with
 * a slow breath so the student notices without having to look for it.
 */
export function ExamClock({ remainingSec, tone }: ExamClockProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(1);

  useEffect(() => {
    if (tone === 'danger' && !reduceMotion) {
      breath.set(
        withRepeat(
          withTiming(1.06, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          -1,
          true,
        ),
      );
    } else {
      breath.set(withTiming(1, { duration: durations.fast }));
    }
  }, [tone, reduceMotion, breath]);

  const pulse = useAnimatedStyle(() => ({ transform: [{ scale: breath.value }] }));
  const colors = {
    calm: { bg: theme.surfaceSunken, fg: theme.onSurface },
    warning: { bg: theme.warningTint, fg: theme.warning },
    danger: { bg: theme.dangerTint, fg: theme.danger },
  }[tone];
  const minutes = Math.ceil(remainingSec / 60);

  return (
    <Animated.View
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} left`}
      style={[
        styles.pill,
        {
          backgroundColor: colors.bg,
          transitionProperty: 'backgroundColor',
          transitionDuration: reduceMotion ? 0 : durations.slow,
        },
        pulse,
      ]}
    >
      <Clock size={16} color={colors.fg} strokeWidth={2.4} />
      <AppText variant="label" weight="semibold" numeric style={{ color: colors.fg }}>
        {formatClock(remainingSec)}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    borderRadius: radius.pill,
  },
});
