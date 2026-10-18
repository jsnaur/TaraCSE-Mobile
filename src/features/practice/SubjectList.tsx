import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { haptics } from '@/lib/haptics';
import { subjectMastery } from '@/lib/mastery';
import type { ExamLevel, Subject } from '@/types/exam';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface SubjectListProps {
  subjects: Subject[];
  level: ExamLevel;
  onSelect: (subject: Subject) => void;
}

/** Subjects as a ruled list: name, share of the exam, topic count and mastery. */
export function SubjectList({ subjects, level, onSelect }: SubjectListProps) {
  const { theme } = useTheme();
  return (
    <Card padding={0}>
      {subjects.map((subject, i) => {
        const mastery = subjectMastery(subject);
        const weight = subject.weight[level];
        return (
          <Pressable
            key={subject.id}
            accessibilityRole="button"
            accessibilityLabel={`${subject.name}. ${subject.topics.length} topics.${
              mastery !== null ? ` ${mastery} percent mastery.` : ' Not started.'
            }`}
            onPress={() => {
              haptics.selection();
              onSelect(subject);
            }}
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
              i < subjects.length - 1
                ? {
                    borderBottomColor: theme.border,
                    borderBottomWidth: StyleSheet.hairlineWidth * 2,
                  }
                : null,
            ]}
          >
            <View style={styles.main}>
              <View style={styles.titleRow}>
                <AppText variant="headline" style={styles.flex} numberOfLines={1}>
                  {subject.name}
                </AppText>
                <AppText variant="label" numeric tone={mastery === null ? 'subtle' : 'default'}>
                  {mastery === null ? 'New' : `${mastery}%`}
                </AppText>
              </View>
              <ProgressBar value={(mastery ?? 0) / 100} height={4} />
              <AppText variant="caption" tone="muted">
                {subject.topics.length} topics{weight ? ` · ${weight}% of the exam` : ''}
              </AppText>
            </View>
            <ChevronRight size={18} color={theme.onSurfaceSubtle} />
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: minTouch + 24,
  },
  main: { flex: 1, gap: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  flex: { flex: 1 },
});
