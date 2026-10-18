import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  withSpring,
} from 'react-native-reanimated';

import { springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const W = 46;
const H = 28;
const KNOB = 22;

/**
 * Visual switch only. The pressable row that owns it carries the `switch` role and
 * state, so the whole row is the touch target.
 */
export function Toggle({ value }: { value: boolean }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useDerivedValue(() =>
    reduceMotion ? (value ? 1 : 0) : withSpring(value ? 1 : 0, springs.snappy),
  );

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.borderStrong, theme.primary]),
  }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (W - KNOB - 6) }],
  }));

  return (
    <Animated.View style={[styles.track, track]}>
      <Animated.View style={[styles.knob, { backgroundColor: theme.surface }, knob]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: { width: W, height: H, borderRadius: H / 2, padding: 3, justifyContent: 'center' },
  knob: { width: KNOB, height: KNOB, borderRadius: KNOB / 2 },
});
