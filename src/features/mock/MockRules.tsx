import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme/tokens';

const RULES = [
  'The timer starts when you begin and does not pause.',
  'Answers stay hidden until you submit. You can change them until then.',
  'Flag a question to find it fast on the question map.',
  'Blank answers count as wrong, like on the real exam.',
] as const;

/** How a mock works, said once before the clock starts. */
export function MockRules() {
  return (
    <Card tone="sunken" padding="lg">
      <View style={styles.list}>
        <AppText variant="label" weight="semibold">
          How it works
        </AppText>
        {RULES.map((rule, i) => (
          <View key={rule} style={styles.rule}>
            <AppText variant="label" tone="subtle" numeric style={styles.num}>
              {i + 1}
            </AppText>
            <AppText variant="label" tone="muted" style={styles.flex}>
              {rule}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  rule: { flexDirection: 'row', gap: spacing.md },
  num: { width: 14 },
  flex: { flex: 1 },
});
