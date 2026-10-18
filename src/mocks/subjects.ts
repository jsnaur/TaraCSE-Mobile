import type { ExamLevel, Subject, SubjectId } from '@/types/exam';

/**
 * CSE coverage with topics under each subject. The web app only lets students choose a
 * whole subject; the mobile app lets them narrow practice and focused mocks to topics.
 * Topic lists follow the Civil Service Commission's published coverage for the
 * Professional and Sub-professional pen-and-paper tests. Question counts are fixture
 * values for layout only.
 */
export const SUBJECTS: readonly Subject[] = [
  {
    id: 'verbal',
    name: 'Verbal Ability',
    shortName: 'Verbal',
    levels: ['professional', 'subprofessional'],
    weight: { professional: 30, subprofessional: 30 },
    topics: [
      {
        id: 'verbal-vocabulary',
        subjectId: 'verbal',
        name: 'Vocabulary',
        summary: 'Word meaning in context',
        questionCount: 142,
      },
      {
        id: 'verbal-synonyms-antonyms',
        subjectId: 'verbal',
        name: 'Synonyms and antonyms',
        summary: 'Closest and opposite meanings',
        questionCount: 118,
      },
      {
        id: 'verbal-grammar',
        subjectId: 'verbal',
        name: 'Grammar and correct usage',
        summary: 'Agreement, tense, pronouns, prepositions',
        questionCount: 164,
      },
      {
        id: 'verbal-error-identification',
        subjectId: 'verbal',
        name: 'Error identification',
        summary: 'Spot the wrong part of a sentence',
        questionCount: 96,
      },
      {
        id: 'verbal-spelling',
        subjectId: 'verbal',
        name: 'Spelling',
        summary: 'Commonly misspelled words',
        questionCount: 74,
      },
      {
        id: 'verbal-idioms',
        subjectId: 'verbal',
        name: 'Idioms and expressions',
        summary: 'Figurative meanings',
        questionCount: 61,
      },
      {
        id: 'verbal-sentence-completion',
        subjectId: 'verbal',
        name: 'Sentence completion',
        summary: 'Pick the word that fits',
        questionCount: 88,
      },
      {
        id: 'verbal-paragraph-organization',
        subjectId: 'verbal',
        name: 'Paragraph organization',
        summary: 'Put sentences in logical order',
        questionCount: 57,
      },
      {
        id: 'verbal-reading-comprehension',
        subjectId: 'verbal',
        name: 'Reading comprehension',
        summary: 'Main idea, inference, details',
        questionCount: 103,
      },
      {
        id: 'verbal-analogy',
        subjectId: 'verbal',
        name: 'Word analogy',
        summary: 'Relationships between word pairs',
        questionCount: 79,
      },
    ],
  },
  {
    id: 'numerical',
    name: 'Numerical Ability',
    shortName: 'Numerical',
    levels: ['professional', 'subprofessional'],
    weight: { professional: 25, subprofessional: 25 },
    topics: [
      {
        id: 'numerical-operations',
        subjectId: 'numerical',
        name: 'Basic operations',
        summary: 'Whole numbers, order of operations',
        questionCount: 120,
      },
      {
        id: 'numerical-fractions',
        subjectId: 'numerical',
        name: 'Fractions and decimals',
        summary: 'Convert, compare, compute',
        questionCount: 98,
      },
      {
        id: 'numerical-percent',
        subjectId: 'numerical',
        name: 'Percentage',
        summary: 'Discounts, interest, increase and decrease',
        questionCount: 106,
      },
      {
        id: 'numerical-ratio',
        subjectId: 'numerical',
        name: 'Ratio and proportion',
        summary: 'Direct, inverse and partitive',
        questionCount: 84,
      },
      {
        id: 'numerical-number-series',
        subjectId: 'numerical',
        name: 'Number series',
        summary: 'Find the next number',
        questionCount: 92,
      },
      {
        id: 'numerical-word-problems',
        subjectId: 'numerical',
        name: 'Word problems',
        summary: 'Age, work, motion, mixture',
        questionCount: 131,
      },
      {
        id: 'numerical-algebra',
        subjectId: 'numerical',
        name: 'Basic algebra',
        summary: 'Equations and expressions',
        questionCount: 77,
      },
      {
        id: 'numerical-data-interpretation',
        subjectId: 'numerical',
        name: 'Data interpretation',
        summary: 'Tables, bar and pie charts',
        questionCount: 69,
      },
    ],
  },
  {
    id: 'analytical',
    name: 'Analytical Ability',
    shortName: 'Analytical',
    levels: ['professional'],
    weight: { professional: 25 },
    topics: [
      {
        id: 'analytical-word-association',
        subjectId: 'analytical',
        name: 'Word association',
        summary: 'Which word does not belong',
        questionCount: 87,
      },
      {
        id: 'analytical-logical-reasoning',
        subjectId: 'analytical',
        name: 'Logical reasoning',
        summary: 'Syllogisms and deductions',
        questionCount: 112,
      },
      {
        id: 'analytical-assumptions',
        subjectId: 'analytical',
        name: 'Assumptions and conclusions',
        summary: 'What must be true',
        questionCount: 74,
      },
      {
        id: 'analytical-data-sufficiency',
        subjectId: 'analytical',
        name: 'Data sufficiency',
        summary: 'Is the information enough',
        questionCount: 58,
      },
      {
        id: 'analytical-patterns',
        subjectId: 'analytical',
        name: 'Abstract patterns',
        summary: 'Sequences of figures and symbols',
        questionCount: 66,
      },
      {
        id: 'analytical-problem-solving',
        subjectId: 'analytical',
        name: 'Problem solving',
        summary: 'Arrangements, schedules, ordering',
        questionCount: 71,
      },
    ],
  },
  {
    id: 'clerical',
    name: 'Clerical Operations',
    shortName: 'Clerical',
    levels: ['subprofessional'],
    weight: { subprofessional: 25 },
    topics: [
      {
        id: 'clerical-filing',
        subjectId: 'clerical',
        name: 'Filing and alphabetizing',
        summary: 'Order names, files and records',
        questionCount: 94,
      },
      {
        id: 'clerical-checking',
        subjectId: 'clerical',
        name: 'Clerical checking',
        summary: 'Compare names, numbers, addresses',
        questionCount: 101,
      },
      {
        id: 'clerical-coding',
        subjectId: 'clerical',
        name: 'Coding and classification',
        summary: 'Sort items by given rules',
        questionCount: 63,
      },
      {
        id: 'clerical-tables',
        subjectId: 'clerical',
        name: 'Reading tables and forms',
        summary: 'Find the right entry fast',
        questionCount: 58,
      },
      {
        id: 'clerical-office',
        subjectId: 'clerical',
        name: 'Office procedures',
        summary: 'Records, correspondence, routing',
        questionCount: 52,
      },
    ],
  },
  {
    id: 'general',
    name: 'General Information',
    shortName: 'Gen. Info',
    levels: ['professional', 'subprofessional'],
    weight: { professional: 20, subprofessional: 20 },
    topics: [
      {
        id: 'general-constitution',
        subjectId: 'general',
        name: 'Philippine Constitution',
        summary: '1987 Constitution, rights, branches',
        questionCount: 128,
      },
      {
        id: 'general-ra-6713',
        subjectId: 'general',
        name: 'Code of Conduct (RA 6713)',
        summary: 'Norms and duties of public officials',
        questionCount: 86,
      },
      {
        id: 'general-human-rights',
        subjectId: 'general',
        name: 'Peace and human rights',
        summary: 'Rights, IHL, peace process',
        questionCount: 64,
      },
      {
        id: 'general-environment',
        subjectId: 'general',
        name: 'Environment management',
        summary: 'Laws on environment and protection',
        questionCount: 59,
      },
      {
        id: 'general-current-events',
        subjectId: 'general',
        name: 'General knowledge',
        summary: 'Philippine history and government',
        questionCount: 72,
      },
    ],
  },
];

export function subjectsForLevel(level: ExamLevel): Subject[] {
  return SUBJECTS.filter((s) => s.levels.includes(level));
}

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function isSubjectId(id: string): id is SubjectId {
  return SUBJECTS.some((s) => s.id === id);
}

export function getTopic(topicId: string) {
  for (const subject of SUBJECTS) {
    const topic = subject.topics.find((t) => t.id === topicId);
    if (topic) return topic;
  }
  return undefined;
}

/** Real exam shape per level (items and minutes), from the web app's mock config. */
export const SIMULATION = {
  professional: { full: { items: 170, minutes: 190 }, half: { items: 85, minutes: 95 } },
  subprofessional: { full: { items: 165, minutes: 160 }, half: { items: 83, minutes: 80 } },
} as const;

export const PASSING_SCORE = 80;
