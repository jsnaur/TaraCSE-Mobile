import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { dealMock, mockShape } from '@/lib/mockExam';
import type { ChoiceId, MockConfig, Question } from '@/types/exam';

/**
 * Fake, in-memory mock exams. Unlike practice there is no reveal while answering: answers
 * can change until the exam is submitted, and a question can be flagged to come back to.
 */
export interface MockRun {
  id: string;
  config: MockConfig;
  questions: Question[];
  /** Aligned with `questions`; `null` until answered. */
  answers: (ChoiceId | null)[];
  flagged: boolean[];
  /** Epoch ms. The clock is derived from this, so it survives re-renders and remounts. */
  startedAt: number;
  limitSec: number;
  submittedAt: number | null;
  /** Set when the clock, not the student, ended the exam. */
  timedOut: boolean;
}

export type MockAction =
  | { type: 'start'; id: string; config: MockConfig; at: number }
  | { type: 'answer'; runId: string; index: number; choice: ChoiceId }
  | { type: 'toggleFlag'; runId: string; index: number }
  | { type: 'submit'; runId: string; at: number; timedOut?: boolean };

export interface MockState {
  runs: Record<string, MockRun>;
}

export const initialMock: MockState = { runs: {} };

function updateRun(state: MockState, runId: string, change: (run: MockRun) => MockRun | null) {
  const run = state.runs[runId];
  // Nothing changes on a submitted exam.
  const next = run && run.submittedAt === null ? change(run) : null;
  return next ? { runs: { ...state.runs, [runId]: next } } : state;
}

export function mockReducer(state: MockState, action: MockAction): MockState {
  switch (action.type) {
    case 'start': {
      const questions = dealMock(action.config);
      const run: MockRun = {
        id: action.id,
        config: action.config,
        questions,
        answers: questions.map(() => null),
        flagged: questions.map(() => false),
        startedAt: action.at,
        limitSec: mockShape(action.config).minutes * 60,
        submittedAt: null,
        timedOut: false,
      };
      return { runs: { ...state.runs, [action.id]: run } };
    }
    case 'answer':
      return updateRun(state, action.runId, (run) => {
        if (run.answers[action.index] === undefined) return null;
        const answers = [...run.answers];
        answers[action.index] = action.choice;
        return { ...run, answers };
      });
    case 'toggleFlag':
      return updateRun(state, action.runId, (run) => {
        if (run.flagged[action.index] === undefined) return null;
        const flagged = [...run.flagged];
        flagged[action.index] = !flagged[action.index];
        return { ...run, flagged };
      });
    case 'submit':
      return updateRun(state, action.runId, (run) => ({
        ...run,
        submittedAt: action.at,
        timedOut: action.timedOut ?? false,
      }));
  }
}

/** Seconds left on the clock at `now`, never below zero. */
export function remainingSec(run: MockRun, now: number): number {
  return Math.max(0, run.limitSec - (now - run.startedAt) / 1000);
}

let runCounter = 0;

export function newMockId(): string {
  runCounter += 1;
  return `m${Date.now().toString(36)}${runCounter}`;
}

interface MockValue extends MockState {
  dispatch: (action: MockAction) => void;
}

const MockContext = createContext<MockValue | null>(null);

export function MockProvider({
  children,
  initial = initialMock,
}: {
  children: ReactNode;
  initial?: MockState;
}) {
  const [state, dispatch] = useReducer(mockReducer, initial);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock(): MockValue {
  const value = useContext(MockContext);
  if (!value) throw new Error('useMock must be used inside MockProvider');
  return value;
}

/** Starts a mock with the clock running and returns its id for the exam route. */
export function useStartMock() {
  const { dispatch } = useMock();
  return (config: MockConfig) => {
    const id = newMockId();
    dispatch({ type: 'start', id, config, at: Date.now() });
    return id;
  };
}
