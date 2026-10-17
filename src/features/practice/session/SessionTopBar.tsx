import { Bookmark, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { durations, spacing } from '@/theme/tokens';

export interface SessionTopBarProps {
  /** 1-based position of the current question. */
  position: number;
  /** `null` for endless practice, which has no end to count toward. */
  total: number | null;
  /** Answered so far, which drives the bar. */
  answered: number;
  bookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: () => void;
}

export function SessionTopBar({
  position,
  total,
  answered,
  bookmarked,
  onClose,
  onToggleBookmark,
}: SessionTopBarProps) {
  return (
    <View style={styles.bar}>
      <IconButton icon={X} label="End session" onPress={onClose} />
      <View style={styles.middle}>
        {total !== null ? (
          <ProgressBar
            value={answered / total}
            tone="accent"
            accessibilityLabel={`${answered} of ${total} answered`}
          />
        ) : (
          <AppText variant="label" tone="muted">
            Endless practice
          </AppText>
        )}
      </View>
      <View style={styles.counter} accessibilityLabel={`Question ${position}`}>
        {/* Keyed so each new number drops in rather than swapping in place. */}
        <Animated.View key={position} entering={FadeInDown.duration(durations.base)}>
          <AppText variant="label" numeric>
            {position}
          </AppText>
        </Animated.View>
        {total !== null ? (
          <AppText variant="label" numeric tone="subtle">
            /{total}
          </AppText>
        ) : null}
      </View>
      <IconButton
        icon={Bookmark}
        label={bookmarked ? 'Remove bookmark' : 'Bookmark this question'}
        selected={bookmarked}
        onPress={onToggleBookmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  middle: { flex: 1, paddingHorizontal: spacing.xs },
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 44,
    justifyContent: 'flex-end',
  },
});
