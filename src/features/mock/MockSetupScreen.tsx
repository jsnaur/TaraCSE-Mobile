import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { LockedItem } from '@/components/ui/LockedItem';
import { OptionRow } from '@/components/ui/OptionRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { formatMinutes } from '@/lib/mockExam';
import { levelLabel } from '@/lib/mastery';
import { SIMULATION, subjectsForLevel } from '@/mocks/subjects';
import { useProfile, useSession } from '@/state/session';
import type { MockConfig } from '@/types/exam';
import { durations, spacing } from '@/theme/tokens';

import { MockRules } from './MockRules';
import { StartMockDialog } from './StartMockDialog';

type Mode = 'simulation' | 'subject';
type Length = 'half' | 'full';

const MODES = [
  { value: 'simulation', label: 'Simulation' },
  { value: 'subject', label: 'One subject' },
] as const;

export function MockSetupScreen() {
  const profile = useProfile();
  const { plan } = useSession();
  const [mode, setMode] = useState<Mode>('simulation');
  const [length, setLength] = useState<Length>('half');
  const [pending, setPending] = useState<MockConfig | null>(null);

  const shape = SIMULATION[profile.level];
  const fullLocked = plan === 'free';
  const caption = (l: Length) => `${shape[l].items} items  ·  ${formatMinutes(shape[l].minutes)}`;

  return (
    <Screen
      header={<ScreenHeader title="New mock" back="back" />}
      footer={
        mode === 'simulation' ? (
          <Button
            label={`Start ${length} simulation`}
            icon={ArrowRight}
            iconPosition="trailing"
            size="lg"
            fullWidth
            onPress={() => setPending({ kind: 'simulation', level: profile.level, length })}
          />
        ) : undefined
      }
    >
      <View style={styles.body}>
        <SegmentedControl
          accessibilityLabel="Kind of mock"
          options={MODES}
          value={mode}
          onChange={setMode}
        />

        {mode === 'simulation' ? (
          <Animated.View key="sim" entering={FadeIn.duration(durations.base)} style={styles.body}>
            <View style={styles.group}>
              <AppText variant="body" tone="muted">
                {`Every subject on the ${levelLabel(profile.level)} exam, in the real order and timing.`}
              </AppText>
              <Card padding={0}>
                <OptionRow
                  title="Half length"
                  caption={caption('half')}
                  selected={length === 'half'}
                  onSelect={() => setLength('half')}
                  showDivider={!fullLocked}
                />
                {fullLocked ? null : (
                  <OptionRow
                    title="Full length"
                    caption={caption('full')}
                    selected={length === 'full'}
                    onSelect={() => setLength('full')}
                    showDivider={false}
                  />
                )}
              </Card>
              {fullLocked ? <LockedItem title={`Full length, ${shape.full.items} items`} /> : null}
            </View>
            <MockRules />
          </Animated.View>
        ) : (
          <Animated.View key="sub" entering={FadeIn.duration(durations.base)} style={styles.group}>
            <AppText variant="body" tone="muted">
              Pick a subject, then the topics to test yourself on.
            </AppText>
            <Card padding={0}>
              {subjectsForLevel(profile.level).map((subject, i, all) => (
                <ListRow
                  key={subject.id}
                  title={subject.name}
                  subtitle={`${subject.topics.length} topics  ·  ${subject.weight[profile.level] ?? 0}% of the exam`}
                  onPress={() =>
                    router.push({
                      pathname: '/mock/topics/[subjectId]',
                      params: { subjectId: subject.id },
                    })
                  }
                  showDivider={i < all.length - 1}
                />
              ))}
            </Card>
          </Animated.View>
        )}
      </View>
      <StartMockDialog config={pending} onCancel={() => setPending(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.xl, paddingTop: spacing.sm },
  group: { gap: spacing.md },
});
