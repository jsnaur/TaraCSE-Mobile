import { Flag } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Kot } from '@/components/kot/Kot';
import { haptics } from '@/lib/haptics';
import type { Question } from '@/types/exam';
import { durations, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { ReportExplanation } from './ReportExplanation';

export interface ExplanationSheetProps {
  visible: boolean;
  onClose: () => void;
  question: Question;
}

type Mode = 'explain' | 'report' | 'sent';

const titles: Record<Mode, string> = {
  explain: 'Why this answer',
  report: 'Report this explanation',
  sent: 'Thanks for telling us',
};

/**
 * KOT walks through the answer. Explanations are AI-written, so the sheet always offers
 * a report flow. Mount with `key={question.id}` so each question starts fresh.
 */
export function ExplanationSheet({ visible, onClose, question }: ExplanationSheetProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<Mode>('explain');
  const [reported, setReported] = useState(false);
  const answer = question.choices.find((c) => c.id === question.answerId);

  const close = () => {
    onClose();
    // Reopening shows the explanation again, never a half-filled form.
    if (mode !== 'explain') setMode('explain');
  };

  return (
    <BottomSheet visible={visible} onClose={close} title={titles[mode]}>
      {mode === 'explain' ? (
        <Animated.View entering={FadeIn.duration(durations.fast)}>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.answer}>
              <Kot mood="guide" size={72} decorative />
              <View style={styles.flex}>
                <AppText variant="caption" tone="muted" style={styles.overline}>
                  THE ANSWER IS
                </AppText>
                <AppText variant="headline">
                  {question.answerId}. {answer?.text}
                </AppText>
              </View>
            </View>
            <AppText variant="body" style={styles.body}>
              {question.explanation}
            </AppText>
          </ScrollView>
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            {reported ? (
              <AppText variant="caption" tone="muted">
                You reported this explanation. We will look into it.
              </AppText>
            ) : (
              <Button
                label="Report this explanation"
                variant="ghost"
                icon={Flag}
                onPress={() => setMode('report')}
                style={styles.reportButton}
              />
            )}
          </View>
        </Animated.View>
      ) : null}

      {mode === 'report' ? (
        <Animated.View entering={FadeIn.duration(durations.fast)}>
          <ReportExplanation
            onBack={() => setMode('explain')}
            onSend={() => {
              haptics.success();
              setReported(true);
              setMode('sent');
            }}
          />
        </Animated.View>
      ) : null}

      {mode === 'sent' ? (
        <Animated.View entering={FadeIn.duration(durations.fast)} style={styles.sent}>
          <View style={styles.answer}>
            <Kot mood="encourage" size={72} decorative />
            <AppText variant="body" tone="muted" style={styles.flex}>
              We will check this explanation and fix it if something is off.
            </AppText>
          </View>
          <Button label="Done" onPress={close} style={styles.done} />
        </Animated.View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  flex: { flex: 1, gap: spacing.xs },
  answer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  overline: { letterSpacing: 1 },
  body: { marginTop: spacing.lg },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  reportButton: { marginLeft: -spacing.lg },
  sent: { gap: spacing.lg, paddingBottom: spacing.sm },
  done: { alignSelf: 'flex-end' },
});
