import { questionsFor } from '@/mocks/questions';
import { getSubject, getTopic, SIMULATION, subjectsForLevel } from '@/mocks/subjects';
import type { ChoiceId, MockConfig, Question } from '@/types/exam';

/** Items and minutes for a mock. Focused mocks carry their own; simulations use the real shape. */
export function mockShape(config: MockConfig): { items: number; minutes: number } {
  if (config.kind === 'focused') return { items: config.count, minutes: config.minutes };
  return SIMULATION[config.level][config.length];
}

/**
 * Deals a mock. A simulation follows the real exam: subjects in order, each sized by its
 * share of the test. A focused mock deals from the chosen topics. The fixture bank is
 * small, so questions repeat within a long mock until the real bank lands.
 */
export function dealMock(config: MockConfig): Question[] {
  if (config.kind === 'focused') return questionsFor(config.topicIds, config.count);
  const { items } = mockShape(config);
  const subjects = subjectsForLevel(config.level);
  const out: Question[] = [];
  subjects.forEach((subject, i) => {
    const isLast = i === subjects.length - 1;
    const share = Math.round((items * (subject.weight[config.level] ?? 0)) / 100);
    const n = Math.max(0, isLast ? items - out.length : Math.min(share, items - out.length));
    out.push(
      ...questionsFor(
        subject.topics.map((t) => t.id),
        n,
      ),
    );
  });
  return out;
}

export interface MockScore {
  total: number;
  answered: number;
  correct: number;
  /** Whole-number percent of all items. Blank answers count as wrong, as on the real test. */
  percent: number;
}

export function scoreMock(questions: readonly Question[], answers: readonly (ChoiceId | null)[]) {
  let answered = 0;
  let correct = 0;
  questions.forEach((q, i) => {
    const a = answers[i];
    if (a === null || a === undefined) return;
    answered += 1;
    if (a === q.answerId) correct += 1;
  });
  const total = questions.length;
  return {
    total,
    answered,
    correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
  } satisfies MockScore;
}

export interface BreakdownRow {
  key: string;
  label: string;
  correct: number;
  total: number;
}

/** Per subject for a simulation, per topic for a focused mock. Keeps first-seen order. */
export function mockBreakdown(
  config: MockConfig,
  questions: readonly Question[],
  answers: readonly (ChoiceId | null)[],
): BreakdownRow[] {
  const rows = new Map<string, BreakdownRow>();
  questions.forEach((q, i) => {
    const key = config.kind === 'focused' ? q.topicId : q.subjectId;
    const label =
      config.kind === 'focused'
        ? (getTopic(q.topicId)?.name ?? 'Other')
        : (getSubject(q.subjectId)?.name ?? 'Other');
    const row = rows.get(key) ?? { key, label, correct: 0, total: 0 };
    row.total += 1;
    if (answers[i] === q.answerId) row.correct += 1;
    rows.set(key, row);
  });
  return [...rows.values()];
}

export type ClockTone = 'calm' | 'warning' | 'danger';

/** Amber in the last 15% (at least a minute), red in the last 5% (at least 30 seconds). */
export function clockTone(remainingSec: number, limitSec: number): ClockTone {
  if (remainingSec <= Math.max(30, limitSec * 0.05)) return 'danger';
  if (remainingSec <= Math.max(60, limitSec * 0.15)) return 'warning';
  return 'calm';
}

/** "1:04:09" past an hour, "12:05" under it. */
export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.ceil(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

/** "1 hr 35 min", "50 min". */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function mockTitle(config: MockConfig): string {
  if (config.kind === 'simulation') {
    return config.length === 'full' ? 'Full simulation' : 'Half simulation';
  }
  return `${getSubject(config.subjectId)?.name ?? 'Focused'} mock`;
}
