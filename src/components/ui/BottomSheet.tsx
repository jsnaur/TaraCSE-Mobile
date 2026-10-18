import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { durations, gutter, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Fraction of the window height the sheet may take at most. */
  maxHeight?: number;
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

/** Modal sheet that slides up, drags down to dismiss, and closes on scrim tap. */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  maxHeight = 0.88,
}: BottomSheetProps) {
  const { theme, elevation } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  // The modal stays mounted after `visible` turns false until the exit slide finishes.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);
  const offset = useSharedValue(windowHeight);

  useEffect(() => {
    if (visible) {
      offset.set(reduceMotion ? 0 : withSpring(0, { ...springs.gentle, damping: 22 }));
    } else {
      offset.set(
        withTiming(
          windowHeight,
          { duration: reduceMotion ? 0 : durations.base, easing: Easing.in(Easing.cubic) },
          (finished) => {
            if (finished) scheduleOnRN(setMounted, false);
          },
        ),
      );
    }
  }, [visible, reduceMotion, windowHeight, offset]);

  const pan = usePanGesture({
    activeOffsetY: 8,
    onUpdate: (e) => {
      offset.set(Math.max(0, e.translationY));
    },
    onDeactivate: (e) => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
      } else {
        offset.set(withSpring(0, springs.snappy));
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [0, windowHeight * 0.6], [1, 0], 'clamp'),
  }));

  return (
    <Modal
      visible={mounted}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* A Modal renders outside the app root, so gestures need their own root here. */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }, scrimStyle]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
          />
        </Animated.View>
        <View style={styles.anchor} pointerEvents="box-none">
          <GestureDetector gesture={pan}>
            <Animated.View
              accessibilityViewIsModal
              style={[
                styles.sheet,
                elevation.level3,
                {
                  backgroundColor: theme.surfaceRaised,
                  paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm,
                  maxHeight: windowHeight * maxHeight,
                },
                sheetStyle,
              ]}
            >
              <View style={[styles.grabber, { backgroundColor: theme.borderStrong }]} />
              {title ? (
                <AppText variant="title" style={styles.title} accessibilityRole="header">
                  {title}
                </AppText>
              ) : null}
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: gutter,
    paddingTop: spacing.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.md },
});
