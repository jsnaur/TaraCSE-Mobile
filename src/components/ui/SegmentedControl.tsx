import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { minTouch, radius, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

const INSET = 4;

/** Equal-width segments with a thumb that slides between them. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { theme, elevation } = useTheme();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const segment = width > 0 ? (width - INSET * 2) / options.length : 0;
  const x = useSharedValue(0);

  const target = index * segment;
  const placed = useRef(false);
  useEffect(() => {
    if (segment === 0) return;
    // First placement is instant so the thumb does not slide in from the left on mount.
    x.set(reduceMotion || !placed.current ? target : withSpring(target, springs.gentle));
    placed.current = true;
  }, [target, segment, reduceMotion, x]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: theme.surfaceSunken }]}
    >
      {segment > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            { width: segment, backgroundColor: theme.surfaceRaised },
            elevation.level1,
            thumbStyle,
          ]}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) {
                haptics.selection();
                onChange(option.value);
              }
            }}
            style={styles.segment}
          >
            <AppText
              variant="label"
              weight={selected ? 'semibold' : 'medium'}
              tone={selected ? 'default' : 'muted'}
              numberOfLines={1}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: INSET,
    minHeight: minTouch,
  },
  thumb: {
    position: 'absolute',
    top: INSET,
    bottom: INSET,
    left: INSET,
    borderRadius: radius.pill,
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
});
