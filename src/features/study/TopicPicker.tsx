import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { SelectRow } from '@/components/ui/SelectRow';
import { haptics } from '@/lib/haptics';
import { masteryOf } from '@/lib/mastery';
import type { Topic } from '@/types/exam';
import { spacing } from '@/theme/tokens';

export interface TopicPickerProps {
  topics: readonly Topic[];
  selected: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
  /** Show each topic's mastery on the right. Off for mock setup, where it adds noise. */
  showMastery?: boolean;
}

/**
 * Topic multi-select shared by practice setup and focused mock setup. Duel does not
 * use it: duels pick coverage only.
 */
export function TopicPicker({ topics, selected, onChange, showMastery = true }: TopicPickerProps) {
  const allSelected = topics.length > 0 && topics.every((t) => selected.has(t.id));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <AppText variant="headline" accessibilityRole="header">
            Topics
          </AppText>
          <AppText variant="caption" tone="muted" accessibilityLiveRegion="polite">
            {selected.size === 0
              ? 'Pick at least one'
              : `${selected.size} of ${topics.length} selected`}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={allSelected ? 'Clear all topics' : 'Select all topics'}
          hitSlop={12}
          onPress={() => {
            haptics.selection();
            onChange(allSelected ? new Set() : new Set(topics.map((t) => t.id)));
          }}
        >
          <AppText variant="label" tone="primary" weight="semibold">
            {allSelected ? 'Clear all' : 'Select all'}
          </AppText>
        </Pressable>
      </View>
      <Card padding={0}>
        {topics.map((topic, i) => {
          const mastery = masteryOf(topic.id);
          return (
            <SelectRow
              key={topic.id}
              title={topic.name}
              caption={topic.summary}
              meta={showMastery ? (mastery === null ? 'New' : `${mastery}%`) : undefined}
              selected={selected.has(topic.id)}
              onToggle={() => toggle(topic.id)}
              showDivider={i < topics.length - 1}
            />
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
});
