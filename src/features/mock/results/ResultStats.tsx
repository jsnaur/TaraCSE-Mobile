import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ResultStatsProps {
  right: number;
  wrong: number;
  blank: number;
  /** Already formatted, e.g. "42:10". */
  timeUsed: string;
}

/** Four figures in one ruled strip, so they read as one line of facts. */
export function ResultStats({ right, wrong, blank, timeUsed }: ResultStatsProps) {
  const { theme } = useTheme();
  const items = [
    { label: 'Right', value: String(right), tone: 'success' as const },
    { label: 'Wrong', value: String(wrong), tone: 'danger' as const },
    { label: 'Blank', value: String(blank), tone: 'default' as const },
    { label: 'Time used', value: timeUsed, tone: 'default' as const },
  ];
  return (
    <Card padding={0} style={styles.card}>
      {items.map((item, i) => (
        <View
          key={item.label}
          accessible
          accessibilityLabel={`${item.label}: ${item.value}`}
          style={[
            styles.cell,
            i > 0
              ? { borderLeftColor: theme.border, borderLeftWidth: StyleSheet.hairlineWidth * 2 }
              : null,
          ]}
        >
          <AppText variant="headline" numeric tone={item.tone}>
            {item.value}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {item.label}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.md },
});
