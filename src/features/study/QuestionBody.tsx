import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { getTopic } from '@/mocks/subjects';
import type { Question } from '@/types/exam';
import { spacing } from '@/theme/tokens';

/** Prompts past this length drop from the title size so four choices still fit. */
const LONG_PROMPT = 110;

const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const;

/** Topic overline, optional passage and the prompt. Shared by practice and mock. */
export function QuestionBody({ question }: { question: Question }) {
  const topic = getTopic(question.topicId);
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" tone="muted" style={styles.overline}>
        {`${topic?.name ?? 'Question'}  ·  ${difficultyLabel[question.difficulty]}`.toUpperCase()}
      </AppText>
      {question.passage ? (
        <Card tone="sunken">
          <AppText variant="body">{question.passage}</AppText>
        </Card>
      ) : null}
      <AppText
        variant={question.prompt.length > LONG_PROMPT ? 'headline' : 'title'}
        accessibilityRole="header"
      >
        {question.prompt}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  overline: { letterSpacing: 1 },
});
