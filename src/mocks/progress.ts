import type { SubjectId } from '@/types/exam';

/** Fixture progress for a student a few weeks into reviewing. */
export const todayStats = {
  answeredToday: 18,
  streakDays: 12,
  accuracy7d: 74,
};

/** Mastery per topic, 0 to 100. Topics missing here count as not started. */
export const topicMastery: Record<string, number> = {
  'verbal-vocabulary': 82,
  'verbal-synonyms-antonyms': 76,
  'verbal-grammar': 64,
  'verbal-error-identification': 58,
  'verbal-spelling': 91,
  'verbal-idioms': 47,
  'verbal-sentence-completion': 70,
  'verbal-paragraph-organization': 39,
  'verbal-reading-comprehension': 66,
  'verbal-analogy': 72,
  'numerical-operations': 88,
  'numerical-fractions': 71,
  'numerical-percent': 63,
  'numerical-ratio': 55,
  'numerical-number-series': 49,
  'numerical-word-problems': 41,
  'numerical-algebra': 60,
  'analytical-word-association': 69,
  'analytical-logical-reasoning': 52,
  'analytical-assumptions': 44,
  'general-constitution': 78,
  'general-ra-6713': 85,
  'general-human-rights': 61,
};

export interface LastSession {
  id: string;
  subjectId: SubjectId;
  topicNames: string[];
  answered: number;
  total: number;
  /** Human time label, already formatted. */
  when: string;
}

export const lastSession: LastSession = {
  id: 'session-ongoing',
  subjectId: 'verbal',
  topicNames: ['Grammar and correct usage', 'Error identification'],
  answered: 8,
  total: 15,
  when: 'Yesterday, 9:40 PM',
};

export interface RecentSession {
  id: string;
  subjectId: SubjectId;
  title: string;
  score: number;
  total: number;
  when: string;
}

export const recentSessions: RecentSession[] = [
  {
    id: 'r1',
    subjectId: 'numerical',
    title: 'Percentage, Ratio and proportion',
    score: 22,
    total: 30,
    when: 'Thu',
  },
  {
    id: 'r2',
    subjectId: 'general',
    title: 'Code of Conduct (RA 6713)',
    score: 14,
    total: 15,
    when: 'Wed',
  },
  {
    id: 'r3',
    subjectId: 'verbal',
    title: 'Paragraph organization',
    score: 7,
    total: 15,
    when: 'Tue',
  },
];
