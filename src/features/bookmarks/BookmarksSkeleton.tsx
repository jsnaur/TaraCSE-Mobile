import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { minTouch, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const ROWS = ['86%', '64%', '78%', '70%'] as const;

/** Mirrors `BookmarkRow` so the list settles into place instead of jumping. */
export function BookmarksSkeleton() {
  const { theme } = useTheme();
  return (
    <View accessibilityLabel="Loading your bookmarks" accessible>
      {ROWS.map((width, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i < ROWS.length - 1 ? { borderBottomColor: theme.border, borderBottomWidth: 1 } : null,
          ]}
        >
          <View style={styles.text}>
            <Skeleton width={96} height={10} />
            <Skeleton width="100%" height={14} />
            <Skeleton width={width} height={14} />
          </View>
          <Skeleton width={22} height={22} radius="sm" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    minHeight: minTouch + spacing.lg,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },
  text: { flex: 1, gap: spacing.sm },
});
