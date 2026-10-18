import { daysUntil, weakestTopics } from '@/lib/mastery';
import { SUBJECTS, subjectsForLevel } from '@/mocks/subjects';

test('daysUntil counts whole days', () => {
  expect(daysUntil('2026-10-20', new Date(2026, 9, 18))).toBe(2);
  expect(daysUntil('2026-10-18', new Date(2026, 9, 18))).toBe(0);
});

test('levels get the right fourth subject', () => {
  const pro = subjectsForLevel('professional').map((s) => s.id);
  const sub = subjectsForLevel('subprofessional').map((s) => s.id);
  expect(pro).toContain('analytical');
  expect(pro).not.toContain('clerical');
  expect(sub).toContain('clerical');
  expect(sub).not.toContain('analytical');
});

test('every topic belongs to its subject and ids are unique', () => {
  const ids = SUBJECTS.flatMap((s) => s.topics.map((t) => t.id));
  expect(new Set(ids).size).toBe(ids.length);
  for (const s of SUBJECTS) for (const t of s.topics) expect(t.subjectId).toBe(s.id);
});

test('weakest topics come back weakest first', () => {
  const rows = weakestTopics('professional', 3);
  expect(rows).toHaveLength(3);
  expect(rows[0]!.mastery).toBeLessThanOrEqual(rows[1]!.mastery);
});
