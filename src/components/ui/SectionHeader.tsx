import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="headline" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          hitSlop={12}
        >
          <AppText variant="label" tone="primary" weight="semibold">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: { flex: 1 },
});
