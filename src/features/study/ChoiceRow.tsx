import { Check, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import type { ChoiceId } from '@/types/exam';
import { durations, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

export interface ChoiceRowProps {
  id: ChoiceId;
  text: string;
  state: ChoiceState;
  onPress?: () => void;
  /** Locked once the answer is checked. */
  disabled?: boolean;
}

const TILE = 32;

const markIn = ZoomIn.springify()
  .damping(springs.snappy.damping)
  .stiffness(springs.snappy.stiffness)
  .mass(springs.snappy.mass);

const stateLabel: Record<ChoiceState, string> = {
  idle: '',
  selected: ', selected',
  correct: ', correct answer',
  wrong: ', your answer, wrong',
  dimmed: '',
};

/**
 * One answer choice. The letter tile is the signature: it fills with ink when picked,
 * then turns into a check or a cross when the answer is revealed.
 */
export function ChoiceRow({ id, text, state, onPress, disabled = false }: ChoiceRowProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const shake = useSharedValue(0);

  useEffect(() => {
    if (state !== 'wrong' || reduceMotion) return;
    shake.set(
      withSequence(
        withTiming(-7, { duration: 45 }),
        withTiming(7, { duration: 70 }),
        withTiming(-4, { duration: 60 }),
        withTiming(0, { duration: 50 }),
      ),
    );
  }, [state, reduceMotion, shake]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const palette = {
    idle: { bg: theme.surface, border: theme.border, tile: theme.surfaceSunken },
    selected: { bg: theme.primaryTint, border: theme.primary, tile: theme.primary },
    correct: { bg: theme.successTint, border: theme.success, tile: theme.success },
    wrong: { bg: theme.dangerTint, border: theme.danger, tile: theme.danger },
    dimmed: { bg: theme.surface, border: theme.border, tile: theme.surfaceSunken },
  }[state];
  const letterColor =
    state === 'idle' || state === 'dimmed' ? theme.onSurfaceMuted : theme.onPrimary;
  const Mark = state === 'correct' ? Check : state === 'wrong' ? X : null;

  return (
    <Animated.View style={shakeStyle}>
      <PressableScale
        accessibilityRole="radio"
        accessibilityLabel={`Choice ${id}: ${text}${stateLabel[state]}`}
        accessibilityState={{ checked: state === 'selected', disabled }}
        disabled={disabled}
        pressedScale={0.985}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.row,
            {
              backgroundColor: palette.bg,
              borderColor: palette.border,
              opacity: state === 'dimmed' ? 0.6 : 1,
              transitionProperty: ['backgroundColor', 'borderColor', 'opacity'],
              transitionDuration: reduceMotion ? 0 : durations.fast,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.tile,
              {
                backgroundColor: palette.tile,
                transitionProperty: 'backgroundColor',
                transitionDuration: reduceMotion ? 0 : durations.fast,
              },
            ]}
          >
            {Mark ? (
              <Animated.View key={state} entering={markIn}>
                <Mark size={18} color={theme.onPrimary} strokeWidth={3} />
              </Animated.View>
            ) : (
              <AppText variant="label" numeric style={{ color: letterColor }}>
                {id}
              </AppText>
            )}
          </Animated.View>
          <View style={styles.text}>
            <AppText variant="body" tone={state === 'dimmed' ? 'muted' : 'default'}>
              {text}
            </AppText>
          </View>
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});
