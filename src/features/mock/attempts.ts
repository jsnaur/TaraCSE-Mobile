import { mockTitle, scoreMock } from '@/lib/mockExam';
import { MOCK_ATTEMPTS } from '@/mocks/mockAttempts';
import type { MockRun } from '@/state/mock';

export interface AttemptSummary {
  id: string;
  title: string;
  correct: number;
  total: number;
  percent: number;
  when: string;
  /** Only mocks taken this session have answers to open. */
  runId: string | null;
}

const timeLabel = (at: number) =>
  new Date(at).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });

/** Mocks finished this session first (newest first), then the fixture history. */
export function attemptHistory(runs: Record<string, MockRun>): AttemptSummary[] {
  const live = Object.values(runs)
    .filter((run) => run.submittedAt !== null)
    .sort((a, b) => (b.submittedAt ?? 0) - (a.submittedAt ?? 0))
    .map((run) => {
      const score = scoreMock(run.questions, run.answers);
      return {
        id: run.id,
        title: mockTitle(run.config),
        correct: score.correct,
        total: score.total,
        percent: score.percent,
        when: `Today, ${timeLabel(run.submittedAt ?? run.startedAt)}`,
        runId: run.id,
      };
    });
  const past = MOCK_ATTEMPTS.map((a) => ({
    id: a.id,
    title: a.title,
    correct: a.correct,
    total: a.total,
    percent: a.total === 0 ? 0 : Math.round((a.correct / a.total) * 100),
    when: a.when,
    runId: null,
  }));
  return [...live, ...past];
}

/** Average of the latest three mocks, or `null` before the first one. */
export function readiness(history: readonly AttemptSummary[]): number | null {
  const recent = history.slice(0, 3);
  if (recent.length === 0) return null;
  return Math.round(recent.reduce((n, a) => n + a.percent, 0) / recent.length);
}
