import { StyleSheet } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { durations, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const SIZE = 22;

/**
 * Visual radio mark only. The pressable row or card that owns it carries the `radio`
 * role and state, so the whole surface is the target.
 */
export function RadioDot({ selected }: { selected: boolean }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          borderColor: selected ? theme.primary : theme.borderStrong,
          transitionProperty: 'borderColor',
          transitionDuration: reduceMotion ? 0 : durations.fast,
        },
      ]}
    >
      {selected ? (
        <Animated.View
          entering={reduceMotion ? undefined : ZoomIn.springify()}
          style={[styles.fill, { backgroundColor: theme.primary }]}
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: { width: SIZE - spacing.md, height: SIZE - spacing.md, borderRadius: radius.pill },
});
