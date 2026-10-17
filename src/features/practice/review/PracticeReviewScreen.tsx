import { router, useLocalSearchParams } from 'expo-router';
import { RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ExplanationSheet } from '@/features/study/ExplanationSheet';
import { scoreRun, useStartPractice, useStudy } from '@/state/study';
import type { ChoiceId, Question } from '@/types/exam';
import { gutter, spacing } from '@/theme/tokens';

import { ReviewRow } from './ReviewRow';
import { ScoreSummary } from './ScoreSummary';

type Filter = 'all' | 'wrong' | 'right';

interface Answered {
  number: number;
  question: Question;
  picked: ChoiceId;
  right: boolean;
}

export function PracticeReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs } = useStudy();
  const startPractice = useStartPractice();
  const run = id ? runs[id] : undefined;

  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  // The target outlives the sheet so its exit slide still has a question to show.
  const [reportTarget, setReportTarget] = useState<Answered | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const close = () => router.dismissTo('/practice');

  if (!run) {
    return (
      <Screen header={<ScreenHeader back="close" onBack={close} />}>
        <EmptyState
          title="This review is gone"
          message="Reviews don't survive a restart yet. Your next session will have one."
          actionLabel="Back to Practice"
          onAction={close}
        />
      </Screen>
    );
  }

  const score = scoreRun(run);
  const answered: Answered[] = [];
  run.answers.forEach((picked, i) => {
    const question = run.questions[i];
    if (picked === null || !question) return;
    answered.push({ number: i + 1, question, picked, right: picked === question.answerId });
  });
  const wrongCount = answered.length - score.correct;
  const shown = answered.filter((a) =>
    filter === 'all' ? true : filter === 'wrong' ? !a.right : a.right,
  );

  const again = () => {
    const next = startPractice(run.config);
    router.replace({ pathname: '/practice/session/[id]', params: { id: next } });
  };

  return (
    <Screen
      scroll={false}
      padded={false}
      header={<ScreenHeader title="Review" back="close" onBack={close} />}
      footer={
        <View style={styles.actions}>
          <Button label="Done" variant="secondary" size="lg" onPress={close} />
          <Button
            label="Practice again"
            icon={RotateCcw}
            size="lg"
            onPress={again}
            style={styles.flex}
          />
        </View>
      }
    >
      <FlatList
        data={shown}
        keyExtractor={(a) => String(a.number)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScoreSummary run={run} score={score} results={answered.map((a) => a.right)} />
            <SegmentedControl
              accessibilityLabel="Show questions"
              options={[
                { value: 'all', label: `All ${answered.length}` },
                { value: 'wrong', label: `Wrong ${wrongCount}` },
                { value: 'right', label: `Right ${score.correct}` },
              ]}
              value={filter}
              onChange={(next) => {
                setFilter(next);
                setExpanded(null);
              }}
            />
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" tone="muted" align="center" style={styles.empty}>
            {filter === 'wrong' ? 'Nothing wrong this time.' : 'No right answers yet. Next time.'}
          </AppText>
        }
        renderItem={({ item, index }) => (
          <ReviewRow
            number={item.number}
            question={item.question}
            picked={item.picked}
            expanded={expanded === item.number}
            onToggle={() => setExpanded(expanded === item.number ? null : item.number)}
            onReport={() => {
              setReportTarget(item);
              setReportOpen(true);
            }}
            showDivider={index < shown.length - 1}
          />
        )}
        extraData={expanded}
      />
      {reportTarget ? (
        <ExplanationSheet
          key={reportTarget.number}
          visible={reportOpen}
          startIn="report"
          question={reportTarget.question}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingHorizontal: gutter, paddingBottom: spacing.xl },
  header: { gap: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md },
  empty: { paddingVertical: spacing['2xl'] },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
