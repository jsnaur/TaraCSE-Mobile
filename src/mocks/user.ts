import type { Profile } from '@/types/user';

export const sampleProfile: Profile = {
  name: 'Andrea Santos',
  email: 'andrea.santos@example.com',
  level: 'professional',
  examDate: '2027-03-08',
  dailyGoal: 30,
  notifications: { dailyReminder: true, streakAlerts: true, duelInvites: false },
};

export const samplePremiumProfile: Profile = {
  ...sampleProfile,
  planRenewsOn: '2027-04-18',
};

/** Profile a fresh registration starts with before onboarding fills it in. */
export function blankProfile(name: string, email: string): Profile {
  return {
    name,
    email,
    level: 'professional',
    examDate: null,
    dailyGoal: 20,
    notifications: { dailyReminder: false, streakAlerts: false, duelInvites: false },
  };
}
