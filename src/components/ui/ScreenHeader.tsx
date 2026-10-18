import { router } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { gutter, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

export interface ScreenHeaderProps {
  /** Large title for tab roots; small centered title for pushed screens. */
  title?: string;
  large?: boolean;
  /** Overline above a large title, e.g. today's date. */
  eyebrow?: string;
  back?: 'back' | 'close' | false;
  onBack?: () => void;
  right?: ReactNode;
}

export function ScreenHeader({
  title,
  large = false,
  eyebrow,
  back = false,
  onBack,
  right,
}: ScreenHeaderProps) {
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  if (large) {
    return (
      <View style={styles.large}>
        <View style={styles.largeText}>
          {eyebrow ? (
            <AppText variant="caption" tone="muted" style={styles.eyebrow}>
              {eyebrow.toUpperCase()}
            </AppText>
          ) : null}
          {title ? (
            <AppText variant="display" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    );
  }

  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {back ? (
          <IconButton
            icon={back === 'close' ? X : ChevronLeft}
            label={back === 'close' ? 'Close' : 'Back'}
            onPress={goBack}
          />
        ) : null}
      </View>
      <AppText variant="headline" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title ?? ''}
      </AppText>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  large: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  largeText: { flex: 1, gap: spacing.xs },
  eyebrow: { letterSpacing: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  side: { width: 96, flexDirection: 'row', alignItems: 'center' },
  sideRight: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
