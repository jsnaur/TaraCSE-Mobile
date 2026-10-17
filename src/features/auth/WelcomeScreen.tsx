import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Kot } from '@/components/kot/Kot';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useStagger } from '@/hooks/useStagger';
import { haptics } from '@/lib/haptics';
import { gutter, minTouch, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const mark = require('@/assets/images/logo/mark.png');

/** Share of KOT's height tucked behind the ink panel, so he stands in it, not on it. */
const TUCK = 0.2;
const KOT_MAX = 400;

/**
 * First screen a signed-out student sees. KOT rises from behind the ink panel that holds
 * the promise and the two ways in; the panel is the same ink as Home's hero card, so the
 * first and the main screen read as one product.
 */
export function WelcomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [stageHeight, setStageHeight] = useState(0);

  const { ink, onInk, onInkMuted } = theme;
  const kotSize = Math.min(stageHeight / (1 - TUCK), width, KOT_MAX);

  const rise = useSharedValue(reduceMotion ? 0 : 1);
  useEffect(() => {
    if (reduceMotion || stageHeight === 0) return;
    rise.set(withDelay(120, withSpring(0, springs.gentle)));
  }, [reduceMotion, stageHeight, rise]);
  const kotStyle = useAnimatedStyle(() => ({
    opacity: 1 - rise.value,
    transform: [{ translateY: rise.value * kotSize * 0.35 }],
  }));

  const enter = useStagger(220, 70);
  const brand = (
    <>
      <Image source={mark} style={styles.mark} resizeMode="contain" />
      <AppText variant="title">TaraCSE</AppText>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.brandRow}>
        {__DEV__ ? (
          <Pressable
            accessibilityRole="header"
            accessibilityLabel="TaraCSE"
            accessibilityHint="Dev builds: long-press for the dev menu"
            delayLongPress={600}
            onLongPress={() => {
              haptics.success();
              router.push('/dev-menu');
            }}
            style={styles.brand}
          >
            {brand}
          </Pressable>
        ) : (
          <View
            accessible
            accessibilityRole="header"
            accessibilityLabel="TaraCSE"
            style={styles.brand}
          >
            {brand}
          </View>
        )}
      </View>

      <View
        style={styles.stage}
        onLayout={(e) => setStageHeight(e.nativeEvent.layout.height)}
        importantForAccessibility="no-hide-descendants"
      >
        {kotSize > 0 ? (
          <Animated.View style={[{ marginBottom: -kotSize * TUCK }, kotStyle]}>
            <Kot mood="hello" size={kotSize} decorative />
          </Animated.View>
        ) : null}
      </View>

      <View
        style={[styles.panel, { backgroundColor: ink, paddingBottom: insets.bottom + spacing.lg }]}
      >
        <Animated.View entering={enter(0)}>
          <AppText variant="caption" style={[styles.overline, { color: onInkMuted }]}>
            CIVIL SERVICE EXAM REVIEWER
          </AppText>
        </Animated.View>
        <Animated.View entering={enter(1)}>
          <AppText variant="display" style={{ color: onInk }}>
            Get ready for the CSE, one short session at a time.
          </AppText>
        </Animated.View>
        <Animated.View entering={enter(2)}>
          <AppText variant="body" style={{ color: onInkMuted }}>
            Practice by topic, take timed mock exams, and see how close you are to passing.
          </AppText>
        </Animated.View>
        <Animated.View entering={enter(3)} style={styles.actions}>
          <Button
            label="Get started"
            variant="accent"
            size="lg"
            fullWidth
            onPress={() => router.push('/register')}
          />
          <Button
            label="I have an account"
            variant="onInk"
            style={styles.center}
            onPress={() => router.push('/login')}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  brandRow: {
    flexDirection: 'row',
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: minTouch },
  mark: { width: 30, height: 28 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  panel: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: gutter,
    paddingTop: spacing['2xl'],
    gap: spacing.md,
  },
  overline: { letterSpacing: 1.2 },
  actions: { gap: spacing.xs, marginTop: spacing.md },
  center: { alignSelf: 'center' },
});
