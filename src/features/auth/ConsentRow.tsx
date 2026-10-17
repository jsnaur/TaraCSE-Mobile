import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { haptics } from '@/lib/haptics';
import { durations, minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const BOX = 24;
/** Horizontal padding of a medium ghost `Button`. */
const GHOST_PAD = spacing.lg + 4;

export interface ConsentRowProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

/**
 * Terms and privacy acceptance. The checkbox row is one large target; the two documents
 * sit underneath as their own buttons so neither is a tiny inline link.
 */
export function ConsentRow({ checked, onToggle, error }: ConsentRowProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const border = error ? theme.danger : checked ? theme.primary : theme.borderStrong;

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={`I agree to the terms of use and the privacy notice${
          error ? `. ${error}` : ''
        }`}
        onPress={() => {
          haptics.selection();
          onToggle();
        }}
        style={styles.row}
      >
        <Animated.View
          style={[
            styles.box,
            {
              borderColor: border,
              backgroundColor: checked ? theme.primary : theme.surface,
              transitionProperty: ['backgroundColor', 'borderColor'],
              transitionDuration: reduceMotion ? 0 : durations.fast,
            },
          ]}
        >
          {checked ? (
            <Animated.View entering={reduceMotion ? undefined : ZoomIn.springify()}>
              <Check size={16} color={theme.onPrimary} strokeWidth={3} />
            </Animated.View>
          ) : null}
        </Animated.View>
        <AppText variant="label" style={styles.label}>
          I agree to the terms of use and the privacy notice.
        </AppText>
      </Pressable>
      <View style={styles.links}>
        <Button label="Terms of use" variant="ghost" onPress={() => router.push('/terms')} />
        <Button label="Privacy notice" variant="ghost" onPress={() => router.push('/privacy')} />
      </View>
      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: minTouch },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
  // Ghost buttons carry their own side padding; this lines their text up with the label.
  links: { flexDirection: 'row', marginLeft: BOX + spacing.md - GHOST_PAD },
});
