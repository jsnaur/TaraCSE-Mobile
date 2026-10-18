import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/components/ui/Toast';
import { ChoiceRow, type ChoiceState } from '@/features/study/ChoiceRow';
import { ExplanationSheet } from '@/features/study/ExplanationSheet';
import { QuestionBody } from '@/features/study/QuestionBody';
import { haptics } from '@/lib/haptics';
import { scoreRun, useStudy } from '@/state/study';
import type { ChoiceId } from '@/types/exam';
import { durations, gutter, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { FeedbackPanel } from './FeedbackPanel';
import { SessionTopBar } from './SessionTopBar';

/** Endless runs deal the next batch when this many questions are left. */
const DEAL_AHEAD = 3;

const questionIn = FadeInRight.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness)
  .mass(springs.gentle.mass);

export function PracticeSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs, bookmarks, dispatch } = useStudy();
  const run = id ? runs[id] : undefined;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const [index, setIndex] = useState(() => {
    const next = run?.answers.findIndex((a) => a === null) ?? -1;
    return next === -1 ? 0 : next;
  });
  const [picked, setPicked] = useState<ChoiceId | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const answered = run ? scoreRun(run).answered : 0;
  // Leaving by back gesture or the hardware button asks first once there is work to lose.
  const disablePrevention = usePreventRemove(!!run && !run.finished && answered > 0, () =>
    setConfirmEnd(true),
  );

  const question = run?.questions[index];
  if (!run || !question) {
    return (
      <Screen header={<ScreenHeader back="close" />}>
        <EmptyState
          title="This session has ended"
          message="Practice sessions don't survive a restart yet. Start a new one from Practice."
          actionLabel="Back to Practice"
          onAction={() => router.replace('/practice')}
        />
      </Screen>
    );
  }

  const saved = run.answers[index] ?? null;
  const checked = saved !== null;
  const total = run.config.count;
  const isLast = total !== null && index === run.questions.length - 1;
  const bookmarked = bookmarks.includes(question.id);

  const stateOf = (choiceId: ChoiceId): ChoiceState => {
    if (!checked) return picked === choiceId ? 'selected' : 'idle';
    if (choiceId === question.answerId) return 'correct';
    return choiceId === saved ? 'wrong' : 'dimmed';
  };

  const finish = () => {
    setConfirmEnd(false);
    disablePrevention();
    dispatch({ type: 'finish', runId: run.id });
    router.replace({ pathname: '/practice/review/[id]', params: { id: run.id } });
  };

  const check = () => {
    if (!picked) return;
    dispatch({ type: 'answer', runId: run.id, index, choice: picked });
    if (picked === question.answerId) haptics.success();
    else haptics.error();
    if (total === null && index >= run.questions.length - DEAL_AHEAD) {
      dispatch({ type: 'dealMore', runId: run.id });
    }
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const close = () => {
    if (answered === 0) router.back();
    else setConfirmEnd(true);
  };

  const toggleBookmark = () => {
    dispatch({ type: 'toggleBookmark', questionId: question.id });
    toast(bookmarked ? 'Removed from Bookmarks' : 'Saved to Bookmarks');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <SessionTopBar
        position={index + 1}
        total={total}
        answered={answered}
        bookmarked={bookmarked}
        onClose={close}
        onToggleBookmark={toggleBookmark}
      />

      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View key={index} entering={questionIn} style={styles.question}>
          <QuestionBody question={question} />
          <View style={styles.choices} accessibilityRole="radiogroup">
            {question.choices.map((choice, i) => (
              <Animated.View
                key={choice.id}
                entering={FadeInDown.delay(60 + i * 40).duration(durations.base)}
              >
                <ChoiceRow
                  id={choice.id}
                  text={choice.text}
                  state={stateOf(choice.id)}
                  disabled={checked}
                  onPress={() => {
                    haptics.selection();
                    setPicked(choice.id);
                  }}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {checked ? (
        <FeedbackPanel
          key={index}
          correct={saved === question.answerId}
          answerId={question.answerId}
          index={index}
          nextLabel={isLast ? 'See how you did' : 'Next'}
          onWhy={() => setWhyOpen(true)}
          onNext={next}
        />
      ) : (
        <View
          style={[
            styles.footer,
            { borderTopColor: theme.border, paddingBottom: insets.bottom + spacing.md },
          ]}
        >
          <Button
            label={picked ? 'Check' : 'Pick an answer'}
            size="lg"
            fullWidth
            disabled={!picked}
            onPress={check}
          />
        </View>
      )}

      <ExplanationSheet
        key={`${index}-${question.id}`}
        visible={whyOpen}
        onClose={() => setWhyOpen(false)}
        question={question}
      />
      <Dialog
        visible={confirmEnd}
        title="End this session?"
        message={
          total === null
            ? `You answered ${answered}. We'll show you how those went.`
            : `You answered ${answered} of ${total}. We'll show you how those went.`
        }
        confirmLabel="End session"
        cancelLabel="Keep going"
        onConfirm={finish}
        onCancel={() => setConfirmEnd(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingTop: spacing.md, paddingBottom: spacing['2xl'] },
  question: { gap: spacing.xl },
  choices: { gap: spacing.sm + 2 },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
