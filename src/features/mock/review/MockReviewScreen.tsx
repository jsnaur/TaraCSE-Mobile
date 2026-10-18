import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ExplanationSheet } from '@/features/study/ExplanationSheet';
import { ReviewRow } from '@/features/study/ReviewRow';
import { useMock } from '@/state/mock';
import type { ChoiceId, Question } from '@/types/exam';
import { gutter, spacing } from '@/theme/tokens';

type Filter = 'all' | 'missed' | 'flagged';

interface Item {
  number: number;
  question: Question;
  picked: ChoiceId | null;
  right: boolean;
  flagged: boolean;
}

export function MockReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs } = useMock();
  const run = id ? runs[id] : undefined;

  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  // The target outlives the sheet so its exit slide still has a question to show.
  const [reportTarget, setReportTarget] = useState<Item | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  if (!run || run.submittedAt === null) {
    return (
      <Screen header={<ScreenHeader back="back" />}>
        <EmptyState
          title="This review is gone"
          message="Reviews don't survive a restart yet. Your next mock will have one."
          actionLabel="Back to Mock"
          onAction={() => router.dismissTo('/mock')}
        />
      </Screen>
    );
  }

  const items: Item[] = run.questions.map((question, i) => {
    const picked = run.answers[i] ?? null;
    return {
      number: i + 1,
      question,
      picked,
      right: picked === question.answerId,
      flagged: run.flagged[i] ?? false,
    };
  });
  const missed = items.filter((it) => !it.right).length;
  const flagged = items.filter((it) => it.flagged).length;
  const shown = items.filter((it) =>
    filter === 'all' ? true : filter === 'missed' ? !it.right : it.flagged,
  );

  return (
    <Screen scroll={false} padded={false} header={<ScreenHeader title="Answers" back="back" />}>
      <FlatList
        data={shown}
        keyExtractor={(it) => String(it.number)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        extraData={expanded}
        ListHeaderComponent={
          <View style={styles.header}>
            <SegmentedControl
              accessibilityLabel="Show items"
              options={[
                { value: 'all', label: `All ${items.length}` },
                { value: 'missed', label: `Missed ${missed}` },
                { value: 'flagged', label: `Flagged ${flagged}` },
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
            {filter === 'missed'
              ? 'Nothing missed. Every item right.'
              : 'You flagged nothing this time.'}
          </AppText>
        }
        renderItem={({ item, index }) => (
          <ReviewRow
            number={item.number}
            question={item.question}
            picked={item.picked}
            flagged={item.flagged}
            expanded={expanded === item.number}
            onToggle={() => setExpanded(expanded === item.number ? null : item.number)}
            onReport={() => {
              setReportTarget(item);
              setReportOpen(true);
            }}
            showDivider={index < shown.length - 1}
          />
        )}
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
  list: { paddingHorizontal: gutter, paddingBottom: spacing['2xl'] },
  header: { paddingTop: spacing.sm, paddingBottom: spacing.md },
  empty: { paddingVertical: spacing['2xl'] },
});
