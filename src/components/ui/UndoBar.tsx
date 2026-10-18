import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptics } from '@/lib/haptics';
import { durations, gutter, minTouch, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

/** How long the student has to take an action back. */
export const UNDO_MS = 4500;

export interface UndoBarProps {
  message: string;
  onUndo: () => void;
  /** Called when the window runs out. */
  onExpire: () => void;
}

/**
 * Floating "Removed / Undo" bar. A hairline along its bottom drains over the undo
 * window, so the student can see how long they have. Mount with a fresh `key` per use;
 * a newer action replaces the bar, so only the latest one can be undone.
 */
export function UndoBar({ message, onUndo, onExpire }: UndoBarProps) {
  const { theme, isDark, elevation } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const left = useSharedValue(1);

  useEffect(() => {
    if (!reduceMotion) left.set(withTiming(0, { duration: UNDO_MS, easing: Easing.linear }));
    const timer = setTimeout(onExpire, UNDO_MS);
    return () => clearTimeout(timer);
  }, [left, onExpire, reduceMotion]);

  const drain = useAnimatedStyle(() => ({ transform: [{ scaleX: left.value }] }));
  const bg = isDark ? theme.surfaceRaised : theme.onSurface;
  const fg = isDark ? theme.onSurface : theme.surface;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.springify()
              .damping(springs.gentle.damping)
              .stiffness(springs.gentle.stiffness)
              .mass(springs.gentle.mass)
      }
      exiting={reduceMotion ? undefined : FadeOutDown.duration(durations.fast)}
      accessibilityLiveRegion="polite"
      style={[
        styles.bar,
        elevation.level3,
        { bottom: insets.bottom + spacing.lg, backgroundColor: bg },
      ]}
    >
      <AppText variant="label" weight="medium" style={[styles.text, { color: fg }]}>
        {message}
      </AppText>
      <PressableScale
        accessibilityRole="button"
        pressedScale={0.92}
        hitSlop={4}
        onPress={() => {
          haptics.light();
          onUndo();
        }}
        style={styles.undo}
      >
        <AppText variant="label" weight="semibold" style={{ color: theme.accent }}>
          Undo
        </AppText>
      </PressableScale>
      <View style={styles.track} pointerEvents="none">
        <Animated.View style={[styles.drain, { backgroundColor: theme.accent }, drain]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  text: { flex: 1, paddingVertical: spacing.md },
  undo: {
    minWidth: minTouch + spacing.lg,
    minHeight: minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2 },
  drain: { flex: 1, transformOrigin: 'left' },
});
