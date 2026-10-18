import { subjectsForLevel } from '@/mocks/subjects';
import { topicMastery } from '@/mocks/progress';
import type { ExamLevel, Subject, Topic } from '@/types/exam';

export function masteryOf(topicId: string): number | null {
  return topicMastery[topicId] ?? null;
}

/** Average mastery across the topics a student has started in this subject. */
export function subjectMastery(subject: Subject): number | null {
  const scores = subject.topics
    .map((t) => topicMastery[t.id])
    .filter((v): v is number => typeof v === 'number');
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** Started topics with the lowest mastery, weakest first. */
export function weakestTopics(
  level: ExamLevel,
  limit = 3,
): { topic: Topic; subject: Subject; mastery: number }[] {
  return subjectsForLevel(level)
    .flatMap((subject) =>
      subject.topics
        .map((topic) => ({ topic, subject, mastery: topicMastery[topic.id] }))
        .filter(
          (row): row is { topic: Topic; subject: Subject; mastery: number } =>
            typeof row.mastery === 'number',
        ),
    )
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, limit);
}

/** Whole days from today to an ISO date (YYYY-MM-DD). Negative once it has passed. */
export function daysUntil(isoDate: string, today = new Date()): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

export function formatExamDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function levelLabel(level: ExamLevel): string {
  return level === 'professional' ? 'Professional' : 'Sub-professional';
}
