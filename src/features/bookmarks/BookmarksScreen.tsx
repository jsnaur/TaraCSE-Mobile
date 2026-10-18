import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { UndoBar } from '@/components/ui/UndoBar';
import { ExplanationSheet } from '@/features/study/ExplanationSheet';
import { useFakeLoad } from '@/hooks/useFakeLoad';
import { useStagger } from '@/hooks/useStagger';
import { haptics } from '@/lib/haptics';
import { getQuestion } from '@/mocks/questions';
import { getSubject, SUBJECTS } from '@/mocks/subjects';
import { useStudy } from '@/state/study';
import type { Question, SubjectId } from '@/types/exam';
import { gutter, spacing, springs } from '@/theme/tokens';

import { BookmarkRow } from './BookmarkRow';
import { BookmarksSkeleton } from './BookmarksSkeleton';

type Filter = SubjectId | 'all';

interface Removal {
  key: number;
  questionId: string;
  index: number;
}

const layout = LinearTransition.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness)
  .mass(springs.gentle.mass);

export function BookmarksScreen() {
  const { bookmarks, dispatch } = useStudy();
  const loading = useFakeLoad();
  const enter = useStagger(0, 50);
  const reduceMotion = useReducedMotion();

  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [removal, setRemoval] = useState<Removal | null>(null);
  // The target outlives the sheet so its exit slide still has a question to show.
  const [reportTarget, setReportTarget] = useState<Question | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const saved = bookmarks.map(getQuestion).filter((q): q is Question => q !== undefined);
  // Chips keep the exam's subject order, so they don't shuffle as bookmarks come and go.
  const counts = new Map<SubjectId, number>();
  SUBJECTS.forEach((subject) => {
    const n = saved.filter((q) => q.subjectId === subject.id).length;
    if (n > 0) counts.set(subject.id, n);
  });
  // Removing the last question of a subject drops its chip, so fall back to All.
  const active: Filter = filter !== 'all' && counts.has(filter) ? filter : 'all';
  const shown = active === 'all' ? saved : saved.filter((q) => q.subjectId === active);

  const remove = (q: Question) => {
    haptics.light();
    dispatch({ type: 'toggleBookmark', questionId: q.id });
    setRemoval((prev) => ({
      key: (prev?.key ?? 0) + 1,
      questionId: q.id,
      index: bookmarks.indexOf(q.id),
    }));
    if (expanded === q.id) setExpanded(null);
  };
  const undo = () => {
    if (!removal) return;
    dispatch({ type: 'restoreBookmark', questionId: removal.questionId, index: removal.index });
    setRemoval(null);
  };
  const expire = useCallback(() => setRemoval(null), []);

  const header = <ScreenHeader title="Bookmarks" back="back" />;

  if (loading) {
    return (
      <Screen header={header}>
        <BookmarksSkeleton />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padded={false} header={header}>
      {saved.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            mood="guide"
            title="Nothing saved yet"
            message="Tap the bookmark on any question in practice. It will wait for you here."
            actionLabel="Go to Practice"
            onAction={() => router.navigate('/practice')}
          />
        </View>
      ) : (
        <Animated.FlatList
          data={shown}
          keyExtractor={(q) => q.id}
          itemLayoutAnimation={reduceMotion ? undefined : layout}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          extraData={expanded}
          ListHeaderComponent={
            <View style={styles.header}>
              <AppText variant="body" tone="muted">
                Tap a question to see its answer.
              </AppText>
              {counts.size > 1 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chips}
                  style={styles.chipScroll}
                >
                  <Chip
                    label={`All ${saved.length}`}
                    selected={active === 'all'}
                    onPress={() => setFilter('all')}
                  />
                  {[...counts].map(([id, n]) => (
                    <Chip
                      key={id}
                      label={`${getSubject(id)?.shortName ?? id} ${n}`}
                      selected={active === id}
                      onPress={() => setFilter(id)}
                    />
                  ))}
                </ScrollView>
              ) : null}
            </View>
          }
          renderItem={({ item, index }) => (
            <BookmarkRow
              question={item}
              entering={enter(index)}
              expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              onRemove={() => remove(item)}
              onReport={() => {
                setReportTarget(item);
                setReportOpen(true);
              }}
              showDivider={index < shown.length - 1}
            />
          )}
        />
      )}

      {removal ? (
        <UndoBar
          key={removal.key}
          message="Removed from Bookmarks"
          onUndo={undo}
          onExpire={expire}
        />
      ) : null}
      {reportTarget ? (
        <ExplanationSheet
          key={reportTarget.id}
          visible={reportOpen}
          startIn="report"
          question={reportTarget}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: gutter, paddingBottom: spacing['2xl'] * 2 },
  header: { gap: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  chipScroll: { marginHorizontal: -gutter },
  chips: { gap: spacing.sm, paddingHorizontal: gutter },
  emptyWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: gutter },
});
