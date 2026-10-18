import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { haptics } from '@/lib/haptics';
import type { Subject, Topic } from '@/types/exam';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Row {
  topic: Topic;
  subject: Subject;
  mastery: number;
}

/**
 * The weakest started topics. Each row opens practice setup with that topic already
 * picked, so the nudge is one tap from doing something about it.
 */
export function FocusTopics({ rows }: { rows: Row[] }) {
  const { theme } = useTheme();
  return (
    <Card padding={0}>
      {rows.map(({ topic, subject, mastery }, i) => (
        <Pressable
          key={topic.id}
          accessibilityRole="button"
          accessibilityLabel={`${topic.name}, ${subject.name}, ${mastery} percent mastery. Practice this topic.`}
          onPress={() => {
            haptics.selection();
            router.push({
              pathname: '/practice/[subjectId]',
              params: { subjectId: subject.id, focus: topic.id },
            });
          }}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
            i < rows.length - 1
              ? { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth * 2 }
              : null,
          ]}
        >
          <View style={styles.text}>
            <AppText variant="body" weight="medium" numberOfLines={2}>
              {topic.name}
            </AppText>
            <AppText variant="caption" tone="muted">
              {subject.name}
            </AppText>
          </View>
          <View style={styles.meter}>
            <AppText
              variant="label"
              numeric
              tone={mastery < 50 ? 'danger' : 'warning'}
              align="right"
            >
              {mastery}%
            </AppText>
            <ProgressBar
              value={mastery / 100}
              tone={mastery < 50 ? 'danger' : 'warning'}
              height={4}
            />
          </View>
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: minTouch + 16,
  },
  text: { flex: 1, gap: 2 },
  meter: { width: 72, gap: 6 },
});
