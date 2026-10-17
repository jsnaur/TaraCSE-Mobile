import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getSubject } from '@/mocks/subjects';
import type { LastSession } from '@/mocks/progress';
import { spacing } from '@/theme/tokens';

export function ContinueCard({ session }: { session: LastSession }) {
  const subject = getSubject(session.subjectId);
  const left = session.total - session.answered;
  return (
    <Card padding="lg">
      <View style={styles.top}>
        <AppText variant="caption" tone="muted">
          {subject?.name ?? 'Practice'} · {session.when}
        </AppText>
        <AppText variant="caption" numeric tone="muted">
          {session.answered}/{session.total}
        </AppText>
      </View>
      <AppText variant="headline" numberOfLines={2} style={styles.title}>
        {session.topicNames.join(', ')}
      </AppText>
      <ProgressBar
        value={session.answered / session.total}
        accessibilityLabel={`${session.answered} of ${session.total} answered`}
      />
      <View style={styles.bottom}>
        <AppText variant="label" tone="muted" style={styles.flex}>
          {left} {left === 1 ? 'question' : 'questions'} left
        </AppText>
        <Button
          label="Continue"
          icon={Play}
          variant="primary"
          onPress={() => router.push(`/practice/session/${session.id}`)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { marginTop: spacing.xs, marginBottom: spacing.md },
  bottom: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.md },
  flex: { flex: 1 },
});
