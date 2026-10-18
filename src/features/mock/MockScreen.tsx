import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useStagger } from '@/hooks/useStagger';
import { levelLabel } from '@/lib/mastery';
import { useMock } from '@/state/mock';
import { useProfile } from '@/state/session';
import { spacing } from '@/theme/tokens';

import { AttemptRow } from './AttemptRow';
import { attemptHistory, readiness } from './attempts';
import { ReadinessCard } from './ReadinessCard';

export function MockScreen() {
  const profile = useProfile();
  const { runs } = useMock();
  const enter = useStagger(0, 70);
  const history = attemptHistory(runs);

  return (
    <Screen
      tabRoot
      header={
        <ScreenHeader large title="Mock exam" eyebrow={`${levelLabel(profile.level)} level`} />
      }
    >
      <Animated.View entering={enter(0)} style={styles.top}>
        <ReadinessCard percent={readiness(history)} basedOn={Math.min(3, history.length)} />
        <Button
          label="Start a mock"
          icon={ArrowRight}
          iconPosition="trailing"
          size="lg"
          onPress={() => router.push('/mock/setup')}
          style={styles.start}
        />
      </Animated.View>

      {history.length > 0 ? (
        <Animated.View entering={enter(1)}>
          <SectionHeader title="Past mocks" />
          <Card padding={0} style={styles.list}>
            {history.map((attempt, i) => (
              <AttemptRow
                key={attempt.id}
                attempt={attempt}
                showDivider={i < history.length - 1}
                onPress={
                  attempt.runId
                    ? () =>
                        router.push({
                          pathname: '/mock/results/[id]',
                          params: { id: attempt.runId ?? '' },
                        })
                    : undefined
                }
              />
            ))}
          </Card>
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { gap: spacing.lg },
  start: { alignSelf: 'flex-start' },
  list: { overflow: 'hidden', paddingLeft: spacing.lg },
});
