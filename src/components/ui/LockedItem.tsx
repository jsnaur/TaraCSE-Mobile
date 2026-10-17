import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { LOCKED_COPY, LockedSheet } from './LockedSheet';

export { LOCKED_COPY };

export interface LockedItemProps {
  title: string;
  /** Optional neutral description of the feature itself, e.g. "Full 170-item exam". */
  description?: string;
}

/** A premium-only item shown to a free account: visible, locked, never sold. */
export function LockedItem({ title, description }: LockedItemProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${LOCKED_COPY}`}
        onPress={() => {
          haptics.selection();
          setOpen(true);
        }}
        style={({ pressed }) => [
          styles.row,
          {
            borderColor: theme.borderStrong,
            backgroundColor: pressed ? theme.surfaceSunken : 'transparent',
          },
        ]}
      >
        <View style={[styles.lock, { backgroundColor: theme.surfaceSunken }]}>
          <Lock size={16} color={theme.onSurfaceMuted} strokeWidth={2.2} />
        </View>
        <View style={styles.text}>
          <AppText variant="body" weight="medium" tone="muted">
            {title}
          </AppText>
          <AppText variant="caption" tone="subtle">
            {description ?? LOCKED_COPY}
          </AppText>
        </View>
      </Pressable>
      <LockedSheet visible={open} onClose={() => setOpen(false)} title={title} />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: minTouch + 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  lock: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
