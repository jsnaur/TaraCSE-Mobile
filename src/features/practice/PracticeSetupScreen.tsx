import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { LockedSheet } from '@/components/ui/LockedSheet';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TopicPicker } from '@/features/study/TopicPicker';
import { getSubject } from '@/mocks/subjects';
import { useSession } from '@/state/session';
import type { Difficulty } from '@/types/exam';
import { spacing } from '@/theme/tokens';

type CountOption = { value: number | null; label: string; premium: boolean };

const COUNTS: CountOption[] = [
  { value: 15, label: '15', premium: false },
  { value: 30, label: '30', premium: false },
  { value: 50, label: '50', premium: true },
  { value: null, label: 'Endless', premium: true },
];

const DIFFICULTIES = [
  { value: 'mixed', label: 'Mixed' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

export function PracticeSetupScreen() {
  const { subjectId, focus } = useLocalSearchParams<{ subjectId: string; focus?: string }>();
  const subject = getSubject(subjectId ?? '');
  const { plan } = useSession();

  const [topics, setTopics] = useState<Set<string>>(() => {
    const valid = subject?.topics.some((t) => t.id === focus);
    return new Set(valid && focus ? [focus] : []);
  });
  const [count, setCount] = useState<number | null>(15);
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [locked, setLocked] = useState<string | null>(null);

  if (!subject) {
    return (
      <Screen header={<ScreenHeader back="back" />}>
        <EmptyState
          title="We couldn't find that subject"
          message="It may have been renamed. Pick a subject from Practice."
          actionLabel="Back to Practice"
          onAction={() => router.replace('/practice')}
        />
      </Screen>
    );
  }

  const canStart = topics.size > 0;
  const startLabel = !canStart
    ? 'Pick a topic to start'
    : count === null
      ? 'Start endless practice'
      : `Start ${count} questions`;

  return (
    <Screen
      header={<ScreenHeader title={subject.name} back="back" />}
      footer={
        <Button
          label={startLabel}
          icon={canStart ? ArrowRight : undefined}
          iconPosition="trailing"
          size="lg"
          fullWidth
          disabled={!canStart}
          onPress={() => router.push('/practice/session/new')}
        />
      }
    >
      <View style={styles.body}>
        <TopicPicker topics={subject.topics} selected={topics} onChange={setTopics} />

        <View style={styles.group}>
          <AppText variant="headline" accessibilityRole="header">
            Questions
          </AppText>
          <View style={styles.chips}>
            {COUNTS.map((option) => {
              const isLocked = option.premium && plan === 'free';
              return (
                <Chip
                  key={option.label}
                  label={option.label}
                  icon={isLocked ? Lock : undefined}
                  selected={!isLocked && count === option.value}
                  onPress={() =>
                    isLocked
                      ? setLocked(
                          option.value === null
                            ? 'Endless practice'
                            : `${option.label}-question sessions`,
                        )
                      : setCount(option.value)
                  }
                />
              );
            })}
          </View>
        </View>

        <View style={styles.group}>
          <AppText variant="headline" accessibilityRole="header">
            Difficulty
          </AppText>
          <SegmentedControl
            accessibilityLabel="Difficulty"
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </View>
      </View>
      <LockedSheet visible={locked !== null} onClose={() => setLocked(null)} title={locked ?? ''} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing['2xl'], paddingTop: spacing.sm },
  group: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
