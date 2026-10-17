import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { durations, gutter, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { Button } from './Button';

export interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Centered confirm dialog. Scales up from 0.94 with the scrim fading in. */
export function Dialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  const { theme, elevation } = useTheme();
  const reduceMotion = useReducedMotion();
  // Stays mounted after `visible` turns false until the exit fade finishes.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);
  const shown = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      shown.set(reduceMotion ? 1 : withSpring(1, springs.snappy));
    } else {
      shown.set(
        withTiming(0, { duration: reduceMotion ? 0 : durations.fast }, (done) => {
          if (done) scheduleOnRN(setMounted, false);
        }),
      );
    }
  }, [visible, reduceMotion, shown]);

  const scrim = useAnimatedStyle(() => ({ opacity: Math.min(1, shown.value) }));
  const card = useAnimatedStyle(() => ({
    opacity: Math.min(1, shown.value),
    transform: [{ scale: 0.94 + 0.06 * shown.value }],
  }));

  return (
    <Modal
      visible={mounted}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onCancel}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }, scrim]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityLabel={cancelLabel}
        />
      </Animated.View>
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[styles.card, elevation.level3, { backgroundColor: theme.surfaceRaised }, card]}
        >
          <AppText variant="title">{title}</AppText>
          {message ? (
            <AppText variant="body" tone="muted">
              {message}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} />
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: gutter },
  card: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
