import { StyleSheet, View } from 'react-native';

import { Kot, type KotMood } from '@/components/kot/Kot';
import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  message?: string;
  mood?: KotMood;
  actionLabel?: string;
  onAction?: () => void;
  /** Error states use the same layout with a retry action. */
  tone?: 'empty' | 'error';
}

export function EmptyState({
  title,
  message,
  mood = 'thinking',
  actionLabel,
  onAction,
  tone = 'empty',
}: EmptyStateProps) {
  return (
    <View style={styles.wrap} accessibilityLiveRegion={tone === 'error' ? 'polite' : 'none'}>
      <Kot mood={mood} size={132} decorative />
      <AppText variant="headline" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" tone="muted" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          variant={tone === 'error' ? 'primary' : 'secondary'}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing['2xl'], gap: spacing.sm },
  message: { maxWidth: 300 },
  action: { alignSelf: 'center', marginTop: spacing.md },
});
