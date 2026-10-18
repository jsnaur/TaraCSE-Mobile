import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { useProfile } from '@/state/session';
import type { Profile } from '@/types/user';

export type OnboardingAnswers = Pick<Profile, 'level' | 'examDate' | 'dailyGoal' | 'notifications'>;

interface DraftValue {
  answers: OnboardingAnswers;
  set: (patch: Partial<OnboardingAnswers>) => void;
}

const DraftContext = createContext<DraftValue | null>(null);

/**
 * Answers collected across the onboarding steps. They live here, not in the session,
 * until the last step hands them over in one `completeOnboarding`.
 */
export function OnboardingDraftProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => ({
    level: profile.level,
    examDate: profile.examDate,
    dailyGoal: profile.dailyGoal,
    notifications: profile.notifications,
  }));
  const value = useMemo<DraftValue>(
    () => ({ answers, set: (patch) => setAnswers((a) => ({ ...a, ...patch })) }),
    [answers],
  );
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useOnboardingDraft(): DraftValue {
  const value = useContext(DraftContext);
  if (!value) throw new Error('useOnboardingDraft must be used inside OnboardingDraftProvider');
  return value;
}
