import type { ExamLevel } from './exam';

export type Plan = 'free' | 'premium';

export interface Profile {
  name: string;
  email: string;
  level: ExamLevel;
  /** ISO date (YYYY-MM-DD) of the target exam, or null if not set. */
  examDate: string | null;
  /** Questions per day. */
  dailyGoal: number;
  notifications: { dailyReminder: boolean; streakAlerts: boolean; duelInvites: boolean };
  /** For Premium only: ISO date the plan renews or ends. Shown, never sold. */
  planRenewsOn?: string;
}
