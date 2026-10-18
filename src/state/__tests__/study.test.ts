import { questionsFor } from '@/mocks/questions';
import { ENDLESS_BATCH, initialStudy, scoreRun, studyReducer } from '@/state/study';
import type { PracticeConfig } from '@/types/exam';

const config: PracticeConfig = {
  subjectId: 'verbal',
  topicIds: ['verbal-grammar'],
  count: 15,
  difficulty: 'mixed',
};

function started(c: PracticeConfig = config) {
  return studyReducer(initialStudy, { type: 'start', id: 'r1', config: c });
}

describe('questionsFor', () => {
  it('deals the chosen topics first and pads from the same subject', () => {
    const qs = questionsFor(['verbal-grammar'], 6);
    expect(qs).toHaveLength(6);
    expect(qs[0]?.topicId).toBe('verbal-grammar');
    expect(qs.every((q) => q.subjectId === 'verbal')).toBe(true);
  });

  it('puts the chosen difficulty ahead of the rest', () => {
    const qs = questionsFor(['verbal-grammar'], 2, { difficulty: 'medium' });
    expect(qs[0]?.difficulty).toBe('medium');
  });

  it('falls back to the whole bank for unknown topics', () => {
    expect(questionsFor(['nope'], 3)).toHaveLength(3);
  });
});

describe('studyReducer', () => {
  it('starts a run with one empty answer per question', () => {
    const run = started().runs.r1!;
    expect(run.questions).toHaveLength(15);
    expect(run.answers.every((a) => a === null)).toBe(true);
  });

  it('records an answer once and ignores a second try', () => {
    let s = started();
    s = studyReducer(s, { type: 'answer', runId: 'r1', index: 0, choice: 'B' });
    s = studyReducer(s, { type: 'answer', runId: 'r1', index: 0, choice: 'A' });
    expect(s.runs.r1!.answers[0]).toBe('B');
  });

  it('scores only answered questions', () => {
    let s = started();
    const q0 = s.runs.r1!.questions[0]!;
    const wrong = q0.choices.find((c) => c.id !== q0.answerId)!.id;
    s = studyReducer(s, { type: 'answer', runId: 'r1', index: 0, choice: q0.answerId });
    s = studyReducer(s, { type: 'answer', runId: 'r1', index: 1, choice: wrong });
    expect(scoreRun(s.runs.r1!)).toEqual({ answered: 2, correct: 1, percent: 50 });
  });

  it('deals more only for endless runs', () => {
    const fixed = studyReducer(started(), { type: 'dealMore', runId: 'r1' });
    expect(fixed.runs.r1!.questions).toHaveLength(15);

    const endless = started({ ...config, count: null });
    const more = studyReducer(endless, { type: 'dealMore', runId: 'r1' });
    expect(more.runs.r1!.questions).toHaveLength(ENDLESS_BATCH * 2);
    expect(more.runs.r1!.answers).toHaveLength(ENDLESS_BATCH * 2);
  });

  it('locks answers once finished', () => {
    let s = studyReducer(started(), { type: 'finish', runId: 'r1' });
    s = studyReducer(s, { type: 'answer', runId: 'r1', index: 0, choice: 'A' });
    expect(s.runs.r1!.answers[0]).toBeNull();
  });

  it('toggles bookmarks newest first', () => {
    let s = studyReducer(initialStudy, { type: 'toggleBookmark', questionId: 'a' });
    s = studyReducer(s, { type: 'toggleBookmark', questionId: 'b' });
    expect(s.bookmarks).toEqual(['b', 'a']);
    s = studyReducer(s, { type: 'toggleBookmark', questionId: 'b' });
    expect(s.bookmarks).toEqual(['a']);
  });

  it('restores a removed bookmark to its old place, once', () => {
    const base = { ...initialStudy, bookmarks: ['a', 'b', 'c'] };
    let s = studyReducer(base, { type: 'toggleBookmark', questionId: 'b' });
    s = studyReducer(s, { type: 'restoreBookmark', questionId: 'b', index: 1 });
    expect(s.bookmarks).toEqual(['a', 'b', 'c']);
    expect(studyReducer(s, { type: 'restoreBookmark', questionId: 'b', index: 0 })).toBe(s);
  });
});
