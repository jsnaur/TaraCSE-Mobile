import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { levelLabel } from '@/lib/mastery';
import { recentSessions } from '@/mocks/progress';
import { getSubject, subjectsForLevel } from '@/mocks/subjects';
import { useProfile } from '@/state/session';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { SubjectList } from './SubjectList';

export function PracticeScreen() {
  const profile = useProfile();
  const { theme } = useTheme();
  const subjects = subjectsForLevel(profile.level);

  return (
    <Screen
      tabRoot
      header={
        <ScreenHeader large title="Practice" eyebrow={`${levelLabel(profile.level)} coverage`} />
      }
    >
      <AppText variant="body" tone="muted" style={styles.lead}>
        Choose a subject, then the topics you want to drill.
      </AppText>
      <SubjectList
        subjects={subjects}
        level={profile.level}
        onSelect={(subject) =>
          router.push({ pathname: '/practice/[subjectId]', params: { subjectId: subject.id } })
        }
      />

      <SectionHeader title="Recent sessions" />
      <Card padding={0}>
        {recentSessions.map((s, i) => {
          const pct = Math.round((s.score / s.total) * 100);
          return (
            <View
              key={s.id}
              accessible
              accessibilityLabel={`${s.title}, ${s.score} of ${s.total}, ${s.when}`}
              style={[
                styles.recent,
                i < recentSessions.length - 1
                  ? {
                      borderBottomColor: theme.border,
                      borderBottomWidth: StyleSheet.hairlineWidth * 2,
                    }
                  : null,
              ]}
            >
              <View style={styles.flex}>
                <AppText variant="body" weight="medium" numberOfLines={1}>
                  {s.title}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {getSubject(s.subjectId)?.name} · {s.when}
                </AppText>
              </View>
              <AppText
                variant="headline"
                numeric
                tone={pct >= 80 ? 'success' : pct >= 60 ? 'default' : 'danger'}
              >
                {s.score}/{s.total}
              </AppText>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { marginBottom: spacing.lg },
  recent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  flex: { flex: 1, gap: 2 },
});
