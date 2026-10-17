import { Check, Lock } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { minTouch, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface SelectRowProps {
  title: string;
  /** Short supporting line, e.g. "38 questions" or "Synonyms, antonyms". */
  caption?: string;
  /** Right-aligned figure such as mastery percent. */
  meta?: string;
  selected: boolean;
  onToggle: () => void;
  locked?: boolean;
  onLockedPress?: () => void;
  showDivider?: boolean;
}

/**
 * Multi-select row used for topic pickers. The whole row is the target; a selected row
 * gains an ink spine on the left and a filled check, so the choice reads at a glance
 * even in a long list.
 */
export function SelectRow({
  title,
  caption,
  meta,
  selected,
  onToggle,
  locked = false,
  onLockedPress,
  showDivider = true,
}: SelectRowProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const on = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    on.set(reduceMotion ? (selected ? 1 : 0) : withSpring(selected ? 1 : 0, springs.snappy));
  }, [selected, reduceMotion, on]);

  const spine = useAnimatedStyle(() => ({ transform: [{ scaleY: on.value }] }));
  const check = useAnimatedStyle(() => ({
    opacity: on.value,
    transform: [{ scale: 0.6 + 0.4 * on.value }],
  }));

  return (
    <Pressable
      accessibilityRole={locked ? 'button' : 'checkbox'}
      accessibilityLabel={caption ? `${title}, ${caption}` : title}
      accessibilityState={locked ? undefined : { checked: selected }}
      accessibilityHint={locked ? 'Not included in your current plan.' : undefined}
      onPress={() => {
        haptics.selection();
        if (locked) onLockedPress?.();
        else onToggle();
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' },
      ]}
    >
      <Animated.View style={[styles.spine, { backgroundColor: theme.primary }, spine]} />
      <View
        style={[
          styles.inner,
          showDivider ? { borderBottomColor: theme.border } : { borderBottomWidth: 0 },
        ]}
      >
        <View style={styles.text}>
          <AppText
            variant="body"
            weight={selected ? 'semibold' : 'medium'}
            tone={locked ? 'subtle' : 'default'}
            numberOfLines={2}
          >
            {title}
          </AppText>
          {caption ? (
            <AppText variant="caption" tone="muted" numberOfLines={1}>
              {caption}
            </AppText>
          ) : null}
        </View>
        {meta && !locked ? (
          <AppText variant="label" numeric tone="muted">
            {meta}
          </AppText>
        ) : null}
        {locked ? (
          <Lock size={18} color={theme.onSurfaceSubtle} strokeWidth={2} />
        ) : (
          <View
            style={[styles.box, { borderColor: selected ? theme.primary : theme.borderStrong }]}
          >
            <Animated.View style={[styles.boxFill, { backgroundColor: theme.primary }, check]}>
              <Check size={14} color={theme.onPrimary} strokeWidth={3} />
            </Animated.View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: minTouch + 12, paddingLeft: spacing.lg },
  spine: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  text: { flex: 1, gap: 2 },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm - 1,
    borderWidth: 2,
    overflow: 'hidden',
  },
  boxFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
