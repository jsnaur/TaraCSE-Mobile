/**
 * Shapes shared by fixtures today and the real data layer later. Keep them close to
 * what the TaraCSE web app stores so a Supabase query can implement them directly.
 */

export type ExamLevel = 'professional' | 'subprofessional';

export type SubjectId = 'verbal' | 'numerical' | 'analytical' | 'clerical' | 'general';

export interface Topic {
  id: string;
  subjectId: SubjectId;
  name: string;
  /** One line on what the topic covers, shown under the name in pickers. */
  summary: string;
  questionCount: number;
}

export interface Subject {
  id: SubjectId;
  name: string;
  /** Short label for chips, tabs and the duel coverage picker. */
  shortName: string;
  /** Which exam levels test this subject. */
  levels: readonly ExamLevel[];
  /** Share of the real exam for each level, as a whole-number percent. */
  weight: Partial<Record<ExamLevel, number>>;
  topics: readonly Topic[];
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type ChoiceId = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  subjectId: SubjectId;
  topicId: string;
  difficulty: Exclude<Difficulty, 'mixed'>;
  /** Optional reading passage or data shown above the prompt. */
  passage?: string;
  prompt: string;
  choices: readonly { id: ChoiceId; text: string }[];
  answerId: ChoiceId;
  /** AI-written explanation. Users can report it (docs/PLAY_STORE.md §3). */
  explanation: string;
}

/** Practice: one subject, one or more of its topics. */
export interface PracticeConfig {
  subjectId: SubjectId;
  topicIds: string[];
  /** `null` = endless. */
  count: number | null;
  difficulty: Difficulty;
}

/**
 * Mock exam. Either the full simulation (every subject for the level, real timing) or
 * a focused mock on one subject and chosen topics.
 */
export type MockConfig =
  | { kind: 'simulation'; level: ExamLevel; length: 'half' | 'full' }
  | { kind: 'focused'; subjectId: SubjectId; topicIds: string[]; minutes: number; count: number };

/** Duel: coverage only. No topic picking, by design. */
export interface DuelConfig {
  coverage: SubjectId | 'mixed';
}
