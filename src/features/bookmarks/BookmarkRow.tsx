import { Bookmark, Flag } from 'lucide-react-native';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { haptics } from '@/lib/haptics';
import { getSubject, getTopic } from '@/mocks/subjects';
import type { Question } from '@/types/exam';
import { durations, minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface BookmarkRowProps {
  question: Question;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onReport: () => void;
  showDivider: boolean;
  entering?: ComponentProps<typeof Animated.View>['entering'];
}

/** A saved question. Tapping it shows the answer and explanation in place. */
export function BookmarkRow({
  question,
  expanded,
  onToggle,
  onRemove,
  onReport,
  showDivider,
  entering,
}: BookmarkRowProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const subject = getSubject(question.subjectId);
  const topic = getTopic(question.topicId);
  const answer = question.choices.find((c) => c.id === question.answerId);
  const where = [subject?.shortName, topic?.name].filter(Boolean).join(' · ');

  return (
    <Animated.View
      entering={entering}
      exiting={reduceMotion ? undefined : FadeOut.duration(durations.fast)}
      style={showDivider ? { borderBottomColor: theme.border, borderBottomWidth: 1 } : null}
    >
      <View style={styles.head}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`${where}. ${question.prompt}`}
          accessibilityState={{ expanded }}
          accessibilityHint={expanded ? 'Hides the answer' : 'Shows the answer and explanation'}
          pressedScale={0.99}
          onPress={() => {
            haptics.selection();
            onToggle();
          }}
          style={styles.text}
        >
          <AppText variant="caption" tone="subtle" numberOfLines={1}>
            {where}
          </AppText>
          <AppText variant="body" numberOfLines={expanded ? undefined : 2}>
            {question.prompt}
          </AppText>
        </PressableScale>
        <IconButton icon={Bookmark} label="Remove bookmark" selected onPress={onRemove} />
      </View>

      {expanded ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(durations.base)}
          style={styles.detail}
        >
          {question.passage ? (
            <AppText
              variant="label"
              tone="muted"
              style={[styles.passage, { borderColor: theme.border }]}
            >
              {question.passage}
            </AppText>
          ) : null}
          <AppText variant="label" tone="success" weight="semibold">
            {`Answer: ${question.answerId}. ${answer?.text ?? ''}`}
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
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: minTouch + spacing.lg,
  },
  text: { flex: 1, gap: 2, paddingVertical: spacing.md },
  detail: { gap: spacing.sm, paddingRight: minTouch, paddingBottom: spacing.md },
  passage: { borderLeftWidth: 2, paddingLeft: spacing.md },
  report: { marginLeft: -spacing.lg },
});
