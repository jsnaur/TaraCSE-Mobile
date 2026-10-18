import {
  clockTone,
  dealMock,
  formatClock,
  formatMinutes,
  mockBreakdown,
  scoreMock,
} from '@/lib/mockExam';
import { SIMULATION } from '@/mocks/subjects';
import { initialMock, mockReducer, remainingSec } from '@/state/mock';
import type { MockConfig } from '@/types/exam';

const focused: MockConfig = {
  kind: 'focused',
  subjectId: 'verbal',
  topicIds: ['verbal-grammar'],
  minutes: 15,
  count: 15,
};

function started(config: MockConfig = focused) {
  return mockReducer(initialMock, { type: 'start', id: 'm1', config, at: 1_000 });
}

describe('dealMock', () => {
  it('deals the real item count for a simulation, subjects in exam order', () => {
    const config: MockConfig = { kind: 'simulation', level: 'professional', length: 'half' };
    const qs = dealMock(config);
    expect(qs).toHaveLength(SIMULATION.professional.half.items);
    expect(qs[0]?.subjectId).toBe('verbal');
    expect(qs.at(-1)?.subjectId).toBe('general');
  });

  it('deals the chosen count for a focused mock', () => {
    expect(dealMock(focused)).toHaveLength(15);
  });
});

describe('mockReducer', () => {
  it('starts with a running clock and nothing answered', () => {
    const run = started().runs.m1!;
    expect(run.limitSec).toBe(15 * 60);
    expect(run.answers.every((a) => a === null)).toBe(true);
    expect(remainingSec(run, 1_000 + 60_000)).toBe(14 * 60);
  });

  it('lets answers change and flags toggle until submit, then freezes', () => {
    let s = started();
    s = mockReducer(s, { type: 'answer', runId: 'm1', index: 0, choice: 'A' });
    s = mockReducer(s, { type: 'answer', runId: 'm1', index: 0, choice: 'C' });
    s = mockReducer(s, { type: 'toggleFlag', runId: 'm1', index: 2 });
    expect(s.runs.m1!.answers[0]).toBe('C');
    expect(s.runs.m1!.flagged[2]).toBe(true);
    s = mockReducer(s, { type: 'submit', runId: 'm1', at: 5_000, timedOut: true });
    expect(s.runs.m1!.timedOut).toBe(true);
    expect(mockReducer(s, { type: 'answer', runId: 'm1', index: 1, choice: 'B' })).toBe(s);
  });
});

describe('scoring', () => {
  it('counts blanks as wrong and groups by topic for a focused mock', () => {
    const run = started().runs.m1!;
    const answers = run.questions.map((q, i) => (i < 3 ? q.answerId : null));
    const score = scoreMock(run.questions, answers);
    expect(score).toMatchObject({ total: 15, answered: 3, correct: 3, percent: 20 });
    const rows = mockBreakdown(run.config, run.questions, answers);
    expect(rows.reduce((n, r) => n + r.total, 0)).toBe(15);
  });
});

describe('clock helpers', () => {
  it('turns amber, then red, near the end', () => {
    expect(clockTone(600, 900)).toBe('calm');
    expect(clockTone(120, 900)).toBe('warning');
    expect(clockTone(30, 900)).toBe('danger');
  });

  it('formats clocks and lengths', () => {
    expect(formatClock(3849)).toBe('1:04:09');
    expect(formatClock(725)).toBe('12:05');
    expect(formatMinutes(95)).toBe('1 hr 35 min');
    expect(formatMinutes(50)).toBe('50 min');
  });
});

describe('edge cases', () => {
  it('scores an empty mock as zero', () => {
    expect(scoreMock([], [])).toEqual({ total: 0, answered: 0, correct: 0, percent: 0 });
  });

  it('stays red at zero and calm with plenty left', () => {
    expect(clockTone(0, 600)).toBe('danger');
    expect(clockTone(5700, 5700)).toBe('calm');
  });
});
