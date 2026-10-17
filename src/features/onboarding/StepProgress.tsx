import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export const ONBOARDING_STEPS = 4;

/**
 * One segment per step. Finished steps are ink, and the current one fills with amber as
 * the screen arrives, so moving forward feels like progress being made, not shown.
 */
export function StepProgress({ step }: { step: number }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const fill = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (!reduceMotion) fill.set(withDelay(180, withSpring(1, springs.gentle)));
  }, [reduceMotion, fill]);

  const current = useAnimatedStyle(() => ({ transform: [{ scaleX: fill.value }] }));

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${step} of ${ONBOARDING_STEPS}`}
      accessibilityValue={{ min: 0, max: ONBOARDING_STEPS, now: step }}
    >
      {Array.from({ length: ONBOARDING_STEPS }, (_, i) => i + 1).map((n) => (
        <View key={n} style={[styles.track, { backgroundColor: theme.border }]}>
          {n < step ? <View style={[styles.fill, { backgroundColor: theme.primary }]} /> : null}
          {n === step ? (
            <Animated.View style={[styles.fill, { backgroundColor: theme.accent }, current]} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', gap: spacing.xs },
  track: { flex: 1, height: 6, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { flex: 1, transformOrigin: 'left' },
});
