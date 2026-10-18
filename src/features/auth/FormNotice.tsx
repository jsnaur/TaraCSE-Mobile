import { CircleAlert } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { haptics } from '@/lib/haptics';
import { durations, minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface FormNoticeProps {
  message: string;
  /** Changes on every failed submit so a repeat failure shakes again. */
  attempt: number;
  action?: { label: string; onPress: () => void };
}

/** Form-level error, for problems no single field owns (wrong password, no connection). */
export function FormNotice({ message, attempt, action }: FormNoticeProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(0);

  useEffect(() => {
    haptics.error();
  }, [attempt]);

  useEffect(() => {
    if (reduceMotion) return;
    const d = durations.fast / 3;
    x.set(
      withSequence(
        withTiming(-6, { duration: d }),
        withTiming(6, { duration: d }),
        withTiming(-3, { duration: d }),
        withTiming(0, { duration: d }),
      ),
    );
  }, [attempt, reduceMotion, x]);

  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(durations.base)}
      exiting={reduceMotion ? undefined : FadeOut.duration(durations.fast)}
      style={[styles.box, { backgroundColor: theme.dangerTint }, shake]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <CircleAlert size={18} color={theme.danger} strokeWidth={2.4} />
      <View style={styles.text}>
        <AppText variant="label">{message}</AppText>
        {action ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            style={styles.action}
          >
            <AppText variant="label" weight="semibold" tone="danger">
              {action.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    borderRadius: radius.md,
  },
  text: { flex: 1, gap: 0 },
  action: { minHeight: minTouch, justifyContent: 'center', alignSelf: 'flex-start' },
});
