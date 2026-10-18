import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { subjectsForLevel } from '@/mocks/subjects';
import { levelLabel } from '@/lib/mastery';
import { spacing } from '@/theme/tokens';
import type { ExamLevel } from '@/types/exam';

import { LevelCard } from './LevelCard';
import { OnboardingStep } from './OnboardingStep';
import { useOnboardingDraft } from './OnboardingDraft';

const LEVELS: { level: ExamLevel; summary: string }[] = [
  { level: 'professional', summary: 'For first and second level government posts.' },
  { level: 'subprofessional', summary: 'For first level government posts.' },
];

export function LevelScreen() {
  const { answers, set } = useOnboardingDraft();

  return (
    <OnboardingStep
      step={1}
      canGoBack={false}
      title="Which exam are you taking?"
      subtitle="This sets the subjects you practice. You can switch later in Settings."
      action={{ label: 'Continue', onPress: () => router.push('/exam-date') }}
    >
      <View accessibilityRole="radiogroup" style={styles.group}>
        {LEVELS.map(({ level, summary }) => (
          <LevelCard
            key={level}
            title={levelLabel(level)}
            summary={summary}
            subjects={subjectsForLevel(level).map((s) => s.name)}
            selected={answers.level === level}
            onSelect={() => set({ level })}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.lg },
});
