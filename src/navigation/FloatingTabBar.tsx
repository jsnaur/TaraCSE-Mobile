// The floating bottom navigation bar, ported from Getsmo and moved onto Reanimated.
//
// Inactive tabs are icon-only at a fixed width; the active tab grows to fit its label.
// The pill is sized from *measured* layout, never from a fraction of the bar, so long
// labels and large system font scales cannot overflow it. Getsmo animated this with
// `Animated` on the JS thread because width is not a transform; Reanimated can animate
// layout props on the UI thread, so the pill no longer stutters when JS is busy.
//
// Colours come only from the navBar token family. Styling bar content with `primary`
// once put navy on navy and hid every label; that is why those tokens exist.

import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { haptics } from '@/lib/haptics';
import { fonts, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface TabMeta {
  label: string;
  icon: LucideIcon;
}

export interface FloatingTabBarProps extends BottomTabBarProps {
  /** Label and icon for each route name in the tab layout. */
  tabs: Record<string, TabMeta>;
}

const BAR_PADDING = 6;
const BAR_HEIGHT = 62;
const INACTIVE_WIDTH = 50;

interface Slot {
  x: number;
  width: number;
}

export function FloatingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
  tabs,
}: FloatingTabBarProps) {
  const { theme, elevation } = useTheme();
  const reduceMotion = useReducedMotion();
  const [slots, setSlots] = useState<Record<number, Slot>>({});
  const x = useSharedValue(0);
  const width = useSharedValue(0);
  const placed = useRef(false);

  const active = slots[state.index];

  useEffect(() => {
    if (!active) return;
    // First placement is instant so the pill does not grow in from the left on launch.
    if (reduceMotion || !placed.current) {
      x.set(active.x);
      width.set(active.width);
      placed.current = true;
      return;
    }
    x.set(withSpring(active.x, springs.gentle));
    width.set(withSpring(active.width, springs.gentle));
  }, [active, reduceMotion, x, width]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    width: width.value,
  }));

  const activeRoute = state.routes[state.index];
  const activeOptions = activeRoute ? descriptors[activeRoute.key]?.options : undefined;
  const hidden =
    activeOptions?.tabBarStyle &&
    typeof activeOptions.tabBarStyle === 'object' &&
    'display' in activeOptions.tabBarStyle &&
    activeOptions.tabBarStyle.display === 'none';
  if (hidden) return null;

  const measure = (index: number) => (e: LayoutChangeEvent) => {
    const { x: lx, width: lw } = e.nativeEvent.layout;
    setSlots((prev) => {
      const current = prev[index];
      if (current && current.x === lx && current.width === lw) return prev;
      return { ...prev, [index]: { x: lx, width: lw } };
    });
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.dock, { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xs }]}
    >
      <View
        accessibilityRole="tablist"
        style={[styles.bar, elevation.level3, { backgroundColor: theme.navBar }]}
      >
        {active ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.pill, { backgroundColor: theme.navBarPill }, pillStyle]}
          />
        ) : null}

        {state.routes.map((route, index) => {
          const meta = tabs[route.name];
          if (!meta) return null;
          const focused = index === state.index;
          const tint = focused ? theme.onNavBarPill : theme.onNavBarMuted;
          const Icon = meta.icon;

          return (
            <Pressable
              key={route.key}
              onLayout={measure(index)}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  haptics.selection();
                  navigateToTab(route.key);
                }
              }}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              style={[styles.tab, focused ? styles.tabActive : styles.tabInactive]}
            >
              <Icon size={20} color={tint} strokeWidth={focused ? 2.4 : 2} />
              {focused ? (
                <AppText
                  variant="label"
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.15}
                  style={[styles.label, { color: tint }]}
                >
                  {meta.label}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    padding: BAR_PADDING,
    alignSelf: 'stretch',
    maxWidth: 440,
    width: '100%',
    marginHorizontal: 'auto',
  },
  pill: {
    position: 'absolute',
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    left: 0,
    borderRadius: radius.pill,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  /** Grows into whatever room the icon-only tabs leave. */
  tabActive: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: spacing.sm + 2,
    minWidth: INACTIVE_WIDTH,
  },
  tabInactive: { width: INACTIVE_WIDTH, flexGrow: 0, flexShrink: 0 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 13 },
});
