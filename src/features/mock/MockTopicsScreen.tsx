import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { OptionRow } from '@/components/ui/OptionRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TopicPicker } from '@/features/study/TopicPicker';
import { formatMinutes } from '@/lib/mockExam';
import { getSubject } from '@/mocks/subjects';
import type { MockConfig } from '@/types/exam';
import { spacing } from '@/theme/tokens';

import { MockRules } from './MockRules';
import { StartMockDialog } from './StartMockDialog';

/** Focused mocks run at the real exam's pace: about a minute per item. */
const LENGTHS = [
  { count: 15, minutes: 15, title: 'Quick check' },
  { count: 30, minutes: 30, title: 'Standard' },
  { count: 50, minutes: 50, title: 'Long sitting' },
] as const;

export function MockTopicsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const subject = getSubject(subjectId ?? '');
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [lengthIndex, setLengthIndex] = useState(1);
  const [pending, setPending] = useState<MockConfig | null>(null);

  if (!subject) {
    return (
      <Screen header={<ScreenHeader back="back" />}>
        <EmptyState
          title="We couldn't find that subject"
          message="It may have been renamed. Pick a subject from the mock setup."
          actionLabel="Back to mock setup"
          onAction={() => router.replace('/mock/setup')}
        />
      </Screen>
    );
  }

  const length = LENGTHS[lengthIndex] ?? LENGTHS[1];
  const canStart = topics.size > 0;

  return (
    <Screen
      header={<ScreenHeader title={`${subject.shortName} mock`} back="back" />}
      footer={
        <Button
          label={canStart ? `Start ${length.count}-item mock` : 'Pick a topic to start'}
          icon={canStart ? ArrowRight : undefined}
          iconPosition="trailing"
          size="lg"
          fullWidth
          disabled={!canStart}
          onPress={() =>
            setPending({
              kind: 'focused',
              subjectId: subject.id,
              topicIds: subject.topics.filter((t) => topics.has(t.id)).map((t) => t.id),
              minutes: length.minutes,
              count: length.count,
            })
          }
        />
      }
    >
      <View style={styles.body}>
        <TopicPicker
          topics={subject.topics}
          selected={topics}
          onChange={setTopics}
          showMastery={false}
        />
        <View style={styles.group}>
          <AppText variant="headline" accessibilityRole="header">
            Length
          </AppText>
          <Card padding={0}>
            {LENGTHS.map((option, i) => (
              <OptionRow
                key={option.count}
                title={option.title}
                caption={formatMinutes(option.minutes)}
                figure={String(option.count)}
                accessibilityLabel={`${option.title}, ${option.count} items in ${formatMinutes(option.minutes)}`}
                selected={i === lengthIndex}
                onSelect={() => setLengthIndex(i)}
                showDivider={i < LENGTHS.length - 1}
              />
            ))}
          </Card>
        </View>
        <MockRules />
      </View>
      <StartMockDialog config={pending} onCancel={() => setPending(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing['2xl'], paddingTop: spacing.sm },
  group: { gap: spacing.md },
});
