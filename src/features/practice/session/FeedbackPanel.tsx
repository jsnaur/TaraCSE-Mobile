import { ArrowRight, BookOpen, Check, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import type { ChoiceId } from '@/types/exam';
import { gutter, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface FeedbackPanelProps {
  correct: boolean;
  answerId: ChoiceId;
  /** Picks one of the short lines below so a streak of right answers doesn't repeat. */
  index: number;
  nextLabel: string;
  onWhy: () => void;
  onNext: () => void;
}

const RIGHT_LINES = ['Nice. Keep it going.', 'That one is yours.', 'Right on.', 'Exactly.'];

const slideIn = SlideInDown.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness)
  .mass(springs.gentle.mass);

/** Replaces the Check button after an answer: a tinted verdict, "Why?" and Next. */
export function FeedbackPanel({
  correct,
  answerId,
  index,
  nextLabel,
  onWhy,
  onNext,
}: FeedbackPanelProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tone = correct ? theme.success : theme.danger;
  const Icon = correct ? Check : X;

  return (
    <Animated.View
      entering={slideIn}
      accessibilityLiveRegion="polite"
      style={[
        styles.panel,
        {
          backgroundColor: correct ? theme.successTint : theme.dangerTint,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      <View style={styles.verdict}>
        <View style={[styles.badge, { backgroundColor: tone }]}>
          <Icon size={18} color={theme.onPrimary} strokeWidth={3} />
        </View>
        <View style={styles.flex}>
          <AppText variant="headline" tone={correct ? 'success' : 'danger'}>
            {correct ? 'Correct' : 'Not quite'}
          </AppText>
          <AppText variant="label" tone="muted">
            {correct ? RIGHT_LINES[index % RIGHT_LINES.length] : `The right answer is ${answerId}.`}
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button label="Why?" variant="secondary" size="lg" icon={BookOpen} onPress={onWhy} />
        <Button
          label={nextLabel}
          size="lg"
          icon={ArrowRight}
          iconPosition="trailing"
          onPress={onNext}
          style={styles.flex}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
