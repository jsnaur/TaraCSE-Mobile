import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { questionsFor } from '@/mocks/questions';
import type { ChoiceId, PracticeConfig, Question } from '@/types/exam';

/**
 * Fake, in-memory study state: practice runs and bookmarks. Like the session, a reload
 * starts empty, so screens that read a run must handle a missing one.
 */

/** Questions dealt at a time. Endless runs deal another batch as they near the end. */
export const ENDLESS_BATCH = 15;

export interface PracticeRun {
  id: string;
  config: PracticeConfig;
  questions: Question[];
  /** Aligned with `questions`; `null` until answered. */
  answers: (ChoiceId | null)[];
  finished: boolean;
}

export interface StudyState {
  runs: Record<string, PracticeRun>;
  /** Bookmarked question ids, newest first. */
  bookmarks: string[];
}

export type StudyAction =
  | { type: 'start'; id: string; config: PracticeConfig }
  | { type: 'answer'; runId: string; index: number; choice: ChoiceId }
  | { type: 'dealMore'; runId: string }
  | { type: 'finish'; runId: string }
  | { type: 'toggleBookmark'; questionId: string };

export const initialStudy: StudyState = { runs: {}, bookmarks: [] };

function deal(config: PracticeConfig, offset: number): Question[] {
  return questionsFor(config.topicIds, config.count ?? ENDLESS_BATCH, {
    difficulty: config.difficulty,
    offset,
  });
}

function updateRun(
  state: StudyState,
  runId: string,
  change: (run: PracticeRun) => PracticeRun | null,
): StudyState {
  const run = state.runs[runId];
  const next = run ? change(run) : null;
  return next ? { ...state, runs: { ...state.runs, [runId]: next } } : state;
}

export function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'start': {
      const questions = deal(action.config, 0);
      const run: PracticeRun = {
        id: action.id,
        config: action.config,
        questions,
        answers: questions.map(() => null),
        finished: false,
      };
      return { ...state, runs: { ...state.runs, [action.id]: run } };
    }
    case 'answer':
      return updateRun(state, action.runId, (run) => {
        if (run.finished || run.answers[action.index] !== null) return null;
        const answers = [...run.answers];
        answers[action.index] = action.choice;
        return { ...run, answers };
      });
    case 'dealMore':
      return updateRun(state, action.runId, (run) => {
        if (run.finished || run.config.count !== null) return null;
        const more = deal(run.config, run.questions.length);
        return {
          ...run,
          questions: [...run.questions, ...more],
          answers: [...run.answers, ...more.map(() => null)],
        };
      });
    case 'finish':
      return updateRun(state, action.runId, (run) =>
        run.finished ? null : { ...run, finished: true },
      );
    case 'toggleBookmark':
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.questionId)
          ? state.bookmarks.filter((id) => id !== action.questionId)
          : [action.questionId, ...state.bookmarks],
      };
  }
}

export interface RunScore {
  answered: number;
  correct: number;
  /** Whole-number percent of answered questions, or `null` before any answer. */
  percent: number | null;
}

export function scoreRun(run: PracticeRun): RunScore {
  let answered = 0;
  let correct = 0;
  run.answers.forEach((choice, i) => {
    if (choice === null) return;
    answered += 1;
    if (choice === run.questions[i]?.answerId) correct += 1;
  });
  return {
    answered,
    correct,
    percent: answered === 0 ? null : Math.round((correct / answered) * 100),
  };
}

let runCounter = 0;

export function newRunId(): string {
  runCounter += 1;
  return `p${Date.now().toString(36)}${runCounter}`;
}

interface StudyValue extends StudyState {
  dispatch: (action: StudyAction) => void;
}

const StudyContext = createContext<StudyValue | null>(null);

export function StudyProvider({
  children,
  initial = initialStudy,
}: {
  children: ReactNode;
  initial?: StudyState;
}) {
  const [state, dispatch] = useReducer(studyReducer, initial);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyValue {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used inside StudyProvider');
  return value;
}

/** Starts a practice run and returns its id for the session route. */
export function useStartPractice() {
  const { dispatch } = useStudy();
  return (config: PracticeConfig) => {
    const id = newRunId();
    dispatch({ type: 'start', id, config });
    return id;
  };
}
