import { Check, ChevronDown, Flag, Minus, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { haptics } from '@/lib/haptics';
import type { ChoiceId, Question } from '@/types/exam';
import { durations, minTouch, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ReviewRowProps {
  /** 1-based number in the session. */
  number: number;
  question: Question;
  /** `null` when a mock item was left blank. */
  picked: ChoiceId | null;
  /** Mock items the student flagged while answering. */
  flagged?: boolean;
  expanded: boolean;
  onToggle: () => void;
  onReport: () => void;
  showDivider: boolean;
}

const layout = LinearTransition.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness)
  .mass(springs.gentle.mass);

export function ReviewRow({
  number,
  question,
  picked,
  expanded,
  onToggle,
  onReport,
  showDivider,
  flagged = false,
}: ReviewRowProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const right = picked === question.answerId;
  const pickedText = question.choices.find((c) => c.id === picked)?.text;
  const answerText = question.choices.find((c) => c.id === question.answerId)?.text;
  const blank = picked === null;
  const Mark = right ? Check : blank ? Minus : X;
  const status = right ? 'right' : blank ? 'blank' : 'wrong';

  const turn = useSharedValue(expanded ? 1 : 0);
  useEffect(() => {
    turn.set(reduceMotion ? (expanded ? 1 : 0) : withSpring(expanded ? 1 : 0, springs.snappy));
  }, [expanded, reduceMotion, turn]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value * 180}deg` }] }));

  return (
    <Animated.View
      layout={layout}
      style={[
        styles.wrap,
        showDivider ? { borderBottomColor: theme.border, borderBottomWidth: 1 } : null,
      ]}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Question ${number}, ${status}${flagged ? ', flagged' : ''}. ${question.prompt}`}
        accessibilityState={{ expanded }}
        accessibilityHint={expanded ? 'Hides the explanation' : 'Shows the explanation'}
        pressedScale={0.99}
        onPress={() => {
          haptics.selection();
          onToggle();
        }}
        style={styles.head}
      >
        <View
          style={[
            styles.mark,
            {
              backgroundColor: right
                ? theme.successTint
                : blank
                  ? theme.surfaceSunken
                  : theme.dangerTint,
            },
          ]}
        >
          <Mark
            size={14}
            color={right ? theme.success : blank ? theme.onSurfaceMuted : theme.danger}
            strokeWidth={3}
          />
        </View>
        <View style={styles.flex}>
          <AppText variant="caption" tone="subtle" numeric>
            {flagged ? `Q${number}  ·  Flagged` : `Q${number}`}
          </AppText>
          <AppText variant="body" numberOfLines={expanded ? undefined : 2}>
            {question.prompt}
          </AppText>
        </View>
        <Animated.View style={chevron}>
          <ChevronDown size={20} color={theme.onSurfaceSubtle} strokeWidth={2} />
        </Animated.View>
      </PressableScale>

      {expanded ? (
        <Animated.View entering={FadeIn.duration(durations.base)} style={styles.detail}>
          {blank ? (
            <AppText variant="label" tone="muted">
              You left this blank.
            </AppText>
          ) : !right ? (
            <AppText variant="label" tone="danger">
              {`You picked ${picked}. ${pickedText ?? ''}`}
            </AppText>
          ) : null}
          <AppText variant="label" tone="success" weight="semibold">
            {`Answer: ${question.answerId}. ${answerText ?? ''}`}
          </AppText>
          <AppText variant="body" tone="muted">
            {question.explanation}
          </AppText>
          <Button
            label="Report this explanation"
            variant="ghost"
            icon={Flag}
            onPress={onReport}
            style={styles.report}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouch + spacing.lg,
    paddingVertical: spacing.md,
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, gap: 2 },
  detail: { gap: spacing.sm, paddingLeft: 26 + spacing.md, paddingBottom: spacing.md },
  report: { marginLeft: -spacing.lg },
});
