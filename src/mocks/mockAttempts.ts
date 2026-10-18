import type { ExamLevel } from '@/types/exam';

/** Mocks a returning student finished before this session, newest first. */
export interface MockAttempt {
  id: string;
  title: string;
  level: ExamLevel;
  correct: number;
  total: number;
  /** Human date label, already formatted. */
  when: string;
}

export const MOCK_ATTEMPTS: readonly MockAttempt[] = [
  {
    id: 'a3',
    title: 'Half simulation',
    level: 'professional',
    correct: 66,
    total: 85,
    when: 'Oct 14',
  },
  {
    id: 'a2',
    title: 'Numerical Ability mock',
    level: 'professional',
    correct: 21,
    total: 30,
    when: 'Oct 9',
  },
  {
    id: 'a1',
    title: 'Half simulation',
    level: 'professional',
    correct: 58,
    total: 85,
    when: 'Oct 2',
  },
];
