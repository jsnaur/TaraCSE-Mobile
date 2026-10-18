import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useEffect, useEffectEvent, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ChoiceRow } from '@/features/study/ChoiceRow';
import { QuestionBody } from '@/features/study/QuestionBody';
import { useNow } from '@/hooks/useNow';
import { haptics } from '@/lib/haptics';
import { clockTone } from '@/lib/mockExam';
import { remainingSec, useMock } from '@/state/mock';
import { gutter, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { ExamFooter } from './ExamFooter';
import { ExamTopBar } from './ExamTopBar';
import { QuestionMap } from './QuestionMap';

const questionIn = FadeInRight.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness)
  .mass(springs.gentle.mass);

export function MockExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs, dispatch } = useMock();
  const run = id ? runs[id] : undefined;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const now = useNow();
  const reduceMotion = useReducedMotion();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  const [index, setIndex] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [confirm, setConfirm] = useState<'leave' | 'submit' | null>(null);

  const live = !!run && run.submittedAt === null;
  const disablePrevention = usePreventRemove(live, () => setConfirm('leave'));

  const left = run ? remainingSec(run, now) : 0;
  const tone = run ? clockTone(left, run.limitSec) : 'calm';

  // A buzz when the clock changes colour, so a student deep in a passage still notices.
  const lastTone = useRef(tone);
  useEffect(() => {
    if (tone !== lastTone.current && tone !== 'calm') haptics.warning();
    lastTone.current = tone;
  }, [tone]);

  // Submit and the clock can land in the same tick; only the first one navigates.
  const leaving = useRef(false);
  const toResults = (runId: string) => {
    if (leaving.current) return;
    leaving.current = true;
    disablePrevention();
    router.replace({ pathname: '/mock/results/[id]', params: { id: runId } });
  };

  // The clock, not the student, ends the exam when time runs out.
  const onTimeUp = useEffectEvent((runId: string) => {
    dispatch({ type: 'submit', runId, at: Date.now(), timedOut: true });
    haptics.warning();
    toResults(runId);
  });
  const runId = live ? run.id : null;
  const deadline = run ? run.startedAt + run.limitSec * 1000 : 0;
  useEffect(() => {
    if (!runId) return;
    const timer = setTimeout(() => onTimeUp(runId), Math.max(0, deadline - Date.now()));
    return () => clearTimeout(timer);
  }, [runId, deadline]);
  // Timers stall while the app is in the background; the next clock tick catches up.
  const expired = left <= 0;
  useEffect(() => {
    if (runId && expired) onTimeUp(runId);
  }, [runId, expired]);

  const question = run?.questions[index];
  if (!run || !question || run.submittedAt !== null) {
    // A live run always has its questions (`dealMock` never deals zero), so this is a
    // missing or finished run.
    return (
      <Screen header={<ScreenHeader back="close" onBack={() => router.replace('/mock')} />}>
        <EmptyState
          title={run?.submittedAt ? 'This exam is already in' : 'This exam has ended'}
          message={
            run?.submittedAt
              ? 'Your answers were submitted. See how you did.'
              : "Mock exams don't survive a restart yet. Start a new one from Mock."
          }
          actionLabel={run?.submittedAt ? 'See results' : 'Back to Mock'}
          onAction={() =>
            run?.submittedAt
              ? router.replace({ pathname: '/mock/results/[id]', params: { id: run.id } })
              : router.replace('/mock')
          }
        />
      </Screen>
    );
  }

  const total = run.questions.length;
  const answered = run.answers.filter((a) => a !== null).length;
  const blank = total - answered;
  const flagCount = run.flagged.filter(Boolean).length;
  const picked = run.answers[index] ?? null;

  const go = (next: number) => {
    setIndex(Math.min(total - 1, Math.max(0, next)));
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const submit = () => {
    setConfirm(null);
    setMapOpen(false);
    dispatch({ type: 'submit', runId: run.id, at: Date.now() });
    haptics.success();
    toResults(run.id);
  };

  const submitMessage = [
    blank > 0
      ? `${blank} ${blank === 1 ? 'item is' : 'items are'} blank and will count as wrong.`
      : 'Every item has an answer.',
    flagCount > 0 ? `${flagCount} flagged for a second look.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ExamTopBar
        position={index + 1}
        total={total}
        answered={answered}
        remainingSec={left}
        tone={tone}
        onLeave={() => setConfirm('leave')}
        onOpenMap={() => setMapOpen(true)}
      />

      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={index}
          entering={reduceMotion ? undefined : questionIn}
          style={styles.question}
        >
          <QuestionBody question={question} />
          <View style={styles.choices} accessibilityRole="radiogroup">
            {question.choices.map((choice) => (
              <ChoiceRow
                key={choice.id}
                id={choice.id}
                text={choice.text}
                state={picked === choice.id ? 'selected' : 'idle'}
                onPress={() => {
                  haptics.selection();
                  dispatch({ type: 'answer', runId: run.id, index, choice: choice.id });
                }}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <ExamFooter
        flagged={run.flagged[index] ?? false}
        isFirst={index === 0}
        isLast={index === total - 1}
        onToggleFlag={() => dispatch({ type: 'toggleFlag', runId: run.id, index })}
        onPrev={() => go(index - 1)}
        onNext={() => (index === total - 1 ? setMapOpen(true) : go(index + 1))}
      />

      <QuestionMap
        visible={mapOpen}
        onClose={() => setMapOpen(false)}
        answers={run.answers}
        flagged={run.flagged}
        current={index}
        onJump={(i) => {
          go(i);
          setMapOpen(false);
        }}
        onSubmit={() => {
          setMapOpen(false);
          setConfirm('submit');
        }}
      />
      <Dialog
        visible={confirm === 'submit'}
        title="Submit your exam?"
        message={`${answered} of ${total} answered. ${submitMessage}`}
        confirmLabel="Submit"
        cancelLabel="Keep going"
        onConfirm={submit}
        onCancel={() => setConfirm(null)}
      />
      <Dialog
        visible={confirm === 'leave'}
        title="Leave this exam?"
        message="It won't be scored, and the answers so far will be lost."
        confirmLabel="Leave exam"
        cancelLabel="Keep going"
        destructive
        onConfirm={() => {
          setConfirm(null);
          disablePrevention();
          router.back();
        }}
        onCancel={() => setConfirm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: gutter, paddingTop: spacing.lg, paddingBottom: spacing['2xl'] },
  question: { gap: spacing.xl },
  choices: { gap: spacing.sm + 2 },
});
