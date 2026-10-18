import type { Difficulty, Question } from '@/types/exam';

/**
 * Original sample questions written for this prototype. Never copy items from the
 * TaraCSE web question bank into this file.
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'q-grammar-1',
    subjectId: 'verbal',
    topicId: 'verbal-grammar',
    difficulty: 'easy',
    prompt: 'Neither the manager nor the clerks ___ aware of the new memo.',
    choices: [
      { id: 'A', text: 'was' },
      { id: 'B', text: 'were' },
      { id: 'C', text: 'is' },
      { id: 'D', text: 'has been' },
    ],
    answerId: 'B',
    explanation:
      'With "neither ... nor", the verb agrees with the subject closer to it. "Clerks" is plural and the sentence is in the past, so "were" is correct.',
  },
  {
    id: 'q-grammar-2',
    subjectId: 'verbal',
    topicId: 'verbal-grammar',
    difficulty: 'medium',
    prompt: 'Choose the correct sentence.',
    choices: [
      { id: 'A', text: 'Each of the applicants have submitted their forms.' },
      { id: 'B', text: 'Each of the applicants has submitted their forms.' },
      { id: 'C', text: 'Each of the applicants have submitted his forms.' },
      { id: 'D', text: 'Each of the applicant has submitted their forms.' },
    ],
    answerId: 'B',
    explanation:
      '"Each" is singular, so it takes "has". "Of the applicants" keeps the plural noun after "of". Singular "their" is accepted in modern usage when gender is unknown.',
  },
  {
    id: 'q-error-1',
    subjectId: 'verbal',
    topicId: 'verbal-error-identification',
    difficulty: 'medium',
    prompt:
      'Find the part with an error: (A) The committee / (B) have already decided / (C) to postpone / (D) the hearing.',
    choices: [
      { id: 'A', text: 'The committee' },
      { id: 'B', text: 'have already decided' },
      { id: 'C', text: 'to postpone' },
      { id: 'D', text: 'the hearing' },
    ],
    answerId: 'B',
    explanation:
      'A committee acting as one body is singular in standard Philippine and American usage, so it should be "has already decided".',
  },
  {
    id: 'q-idiom-1',
    subjectId: 'verbal',
    topicId: 'verbal-idioms',
    difficulty: 'easy',
    prompt:
      'After weeks of delay, the office finally decided to "bite the bullet." This means the office',
    choices: [
      { id: 'A', text: 'faced a hard situation it had been avoiding' },
      { id: 'B', text: 'punished the staff responsible' },
      { id: 'C', text: 'spent more money than planned' },
      { id: 'D', text: 'gave up on the project' },
    ],
    answerId: 'A',
    explanation:
      '"Bite the bullet" means to accept and face something unpleasant that cannot be avoided any longer.',
  },
  {
    id: 'q-vocab-1',
    subjectId: 'verbal',
    topicId: 'verbal-vocabulary',
    difficulty: 'medium',
    prompt:
      'The new guidelines were meant to ameliorate the long queues at the front desk. Ameliorate means to',
    choices: [
      { id: 'A', text: 'measure' },
      { id: 'B', text: 'improve' },
      { id: 'C', text: 'ignore' },
      { id: 'D', text: 'extend' },
    ],
    answerId: 'B',
    explanation:
      '"Ameliorate" means to make something bad better. The guidelines aim to improve the queues.',
  },
  {
    id: 'q-analogy-1',
    subjectId: 'verbal',
    topicId: 'verbal-analogy',
    difficulty: 'easy',
    prompt: 'PEN is to WRITER as GAVEL is to',
    choices: [
      { id: 'A', text: 'carpenter' },
      { id: 'B', text: 'court' },
      { id: 'C', text: 'judge' },
      { id: 'D', text: 'hammer' },
    ],
    answerId: 'C',
    explanation:
      'The pairs link a tool to the person who uses it. A writer uses a pen; a judge uses a gavel.',
  },
  {
    id: 'q-paragraph-1',
    subjectId: 'verbal',
    topicId: 'verbal-paragraph-organization',
    difficulty: 'hard',
    passage:
      '1. As a result, many towns now hold barangay clean-up drives every month.\n2. Plastic waste blocks drainage during heavy rains.\n3. Blocked drains then cause floods in low-lying streets.\n4. Local officials have started to treat waste as a flood problem.',
    prompt: 'Which order makes the most logical paragraph?',
    choices: [
      { id: 'A', text: '2, 3, 4, 1' },
      { id: 'B', text: '4, 2, 3, 1' },
      { id: 'C', text: '2, 4, 3, 1' },
      { id: 'D', text: '1, 2, 3, 4' },
    ],
    answerId: 'A',
    explanation:
      'Cause comes first (2), then its effect (3), then the response (4), and "As a result" closes with the outcome (1).',
  },
  {
    id: 'q-percent-1',
    subjectId: 'numerical',
    topicId: 'numerical-percent',
    difficulty: 'easy',
    prompt: 'A printer costs ₱8,000. It is sold at 15% off. What is the sale price?',
    choices: [
      { id: 'A', text: '₱6,800' },
      { id: 'B', text: '₱7,200' },
      { id: 'C', text: '₱6,500' },
      { id: 'D', text: '₱7,850' },
    ],
    answerId: 'A',
    explanation: '15% of 8,000 is 1,200. Subtract it: 8,000 − 1,200 = 6,800.',
  },
  {
    id: 'q-ratio-1',
    subjectId: 'numerical',
    topicId: 'numerical-ratio',
    difficulty: 'medium',
    prompt: 'Ana and Ben share ₱3,600 in the ratio 5 : 4. How much does Ben get?',
    choices: [
      { id: 'A', text: '₱1,400' },
      { id: 'B', text: '₱1,600' },
      { id: 'C', text: '₱2,000' },
      { id: 'D', text: '₱1,800' },
    ],
    answerId: 'B',
    explanation:
      'There are 5 + 4 = 9 parts, so one part is 3,600 ÷ 9 = 400. Ben gets 4 × 400 = 1,600.',
  },
  {
    id: 'q-series-1',
    subjectId: 'numerical',
    topicId: 'numerical-number-series',
    difficulty: 'medium',
    prompt: 'What comes next? 3, 6, 11, 18, 27, ___',
    choices: [
      { id: 'A', text: '36' },
      { id: 'B', text: '38' },
      { id: 'C', text: '40' },
      { id: 'D', text: '35' },
    ],
    answerId: 'B',
    explanation: 'The gaps are 3, 5, 7, 9, so the next gap is 11. 27 + 11 = 38.',
  },
  {
    id: 'q-work-1',
    subjectId: 'numerical',
    topicId: 'numerical-word-problems',
    difficulty: 'hard',
    prompt:
      'One clerk can encode a batch of forms in 6 hours. Another can do it in 3 hours. Working together, how long will they take?',
    choices: [
      { id: 'A', text: '4.5 hours' },
      { id: 'B', text: '2 hours' },
      { id: 'C', text: '2.5 hours' },
      { id: 'D', text: '3 hours' },
    ],
    answerId: 'B',
    explanation:
      'Together they do 1/6 + 1/3 = 1/2 of the batch per hour, so the whole batch takes 2 hours.',
  },
  {
    id: 'q-logic-1',
    subjectId: 'analytical',
    topicId: 'analytical-logical-reasoning',
    difficulty: 'medium',
    prompt:
      'All licensed teachers passed the board exam. Some employees in the division office are licensed teachers. Which must be true?',
    choices: [
      { id: 'A', text: 'All employees passed the board exam.' },
      { id: 'B', text: 'Some employees passed the board exam.' },
      { id: 'C', text: 'No employee failed the board exam.' },
      { id: 'D', text: 'Everyone who passed is a teacher.' },
    ],
    answerId: 'B',
    explanation:
      'The employees who are licensed teachers must have passed, so at least some employees passed. Nothing is known about the rest.',
  },
  {
    id: 'q-assoc-1',
    subjectId: 'analytical',
    topicId: 'analytical-word-association',
    difficulty: 'easy',
    prompt: 'Which word does not belong?',
    choices: [
      { id: 'A', text: 'Ordinance' },
      { id: 'B', text: 'Statute' },
      { id: 'C', text: 'Decree' },
      { id: 'D', text: 'Ballot' },
    ],
    answerId: 'D',
    explanation: 'Ordinance, statute and decree are kinds of law. A ballot is used to vote.',
  },
  {
    id: 'q-constitution-1',
    subjectId: 'general',
    topicId: 'general-constitution',
    difficulty: 'easy',
    prompt: 'Under the 1987 Constitution, the term of office of a Senator is',
    choices: [
      { id: 'A', text: '3 years' },
      { id: 'B', text: '4 years' },
      { id: 'C', text: '6 years' },
      { id: 'D', text: '9 years' },
    ],
    answerId: 'C',
    explanation:
      'Article VI, Section 4 sets a six-year term for Senators, with no more than two consecutive terms.',
  },
  {
    id: 'q-6713-1',
    subjectId: 'general',
    topicId: 'general-ra-6713',
    difficulty: 'medium',
    prompt:
      'Under RA 6713, public officials must act on letters and requests from the public within how many working days?',
    choices: [
      { id: 'A', text: '5' },
      { id: 'B', text: '10' },
      { id: 'C', text: '15' },
      { id: 'D', text: '30' },
    ],
    answerId: 'C',
    explanation:
      'Section 5(a) requires officials to respond to letters, telegrams and other requests within fifteen working days from receipt.',
  },
  {
    id: 'q-clerical-1',
    subjectId: 'clerical',
    topicId: 'clerical-filing',
    difficulty: 'easy',
    prompt: 'Which name should be filed first alphabetically?',
    choices: [
      { id: 'A', text: 'Dela Cruz, Maria' },
      { id: 'B', text: 'De Leon, Jose' },
      { id: 'C', text: 'Del Rosario, Ana' },
      { id: 'D', text: 'Delgado, Pedro' },
    ],
    answerId: 'A',
    explanation:
      'Ignore spaces and treat each surname as one unit: DELACRUZ, DELEON, DELGADO, DELROSARIO. "Delac..." comes before "Dele...".',
  },
];

export interface DealOptions {
  difficulty?: Difficulty;
  /** Where to start in the pool, so an endless session's next batch continues the cycle. */
  offset?: number;
}

/**
 * Deals `count` questions for the chosen topics. The fixture bank is small, so the pool is
 * padded in order of relevance: matching topic and difficulty, then the rest of those
 * topics, then the same subject. Unknown topics fall back to the whole bank. Questions
 * repeat only after the pool runs out.
 */
export function questionsFor(
  topicIds: readonly string[],
  count: number,
  { difficulty = 'mixed', offset = 0 }: DealOptions = {},
): Question[] {
  const inTopics = QUESTIONS.filter((q) => topicIds.includes(q.topicId));
  const subjects = new Set(inTopics.map((q) => q.subjectId));
  const ranked = [
    ...inTopics.filter((q) => difficulty === 'mixed' || q.difficulty === difficulty),
    ...inTopics,
    ...QUESTIONS.filter((q) => subjects.has(q.subjectId)),
  ];
  const pool = ranked.length > 0 ? [...new Set(ranked)] : [...QUESTIONS];
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const q = pool[(offset + i) % pool.length];
    if (q) out.push(q);
  }
  return out;
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
