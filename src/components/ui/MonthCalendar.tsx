import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  ZoomIn,
  useReducedMotion,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { isoFor, monthGrid, monthTitle, shiftMonth, toISODate } from '@/lib/dates';
import { durations, minTouch, radius, spacing, springs } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const CELL = minTouch;

export interface MonthCalendarProps {
  /** Selected ISO date, or null for none. */
  value: string | null;
  onChange: (iso: string) => void;
  /** First and last selectable ISO dates, inclusive. */
  min: string;
  max: string;
}

function monthOf(iso: string): [number, number] {
  const [y, m] = iso.split('-').map(Number);
  return [y ?? 2000, (m ?? 1) - 1];
}

/**
 * Inline month grid for picking a single day. Built here rather than with a native
 * picker so it looks the same on every device and on web, and so the day stays visible
 * while the student reads the countdown under it.
 */
export function MonthCalendar({ value, onChange, min, max }: MonthCalendarProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [[year, month], setShown] = useState(() => monthOf(value ?? min));
  const [direction, setDirection] = useState<1 | -1>(1);
  const today = toISODate(new Date());
  const [minY, minM] = monthOf(min);
  const [maxY, maxM] = monthOf(max);
  const atStart = year === minY && month === minM;
  const atEnd = year === maxY && month === maxM;

  const go = (by: 1 | -1) => {
    haptics.selection();
    setDirection(by);
    setShown(shiftMonth(year, month, by));
  };

  const entering = reduceMotion
    ? undefined
    : (direction === 1 ? FadeInRight : FadeInLeft).duration(durations.base);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <AppText variant="headline" accessibilityRole="header" accessibilityLiveRegion="polite">
          {monthTitle(year, month)}
        </AppText>
        <View style={styles.nav}>
          <IconButton
            icon={ChevronLeft}
            label="Previous month"
            disabled={atStart}
            onPress={() => go(-1)}
          />
          <IconButton
            icon={ChevronRight}
            label="Next month"
            disabled={atEnd}
            onPress={() => go(1)}
          />
        </View>
      </View>

      <View style={styles.row} importantForAccessibility="no-hide-descendants">
        {WEEKDAYS.map((d, i) => (
          <View key={i} style={styles.weekday}>
            <AppText variant="caption" tone="subtle">
              {d}
            </AppText>
          </View>
        ))}
      </View>

      <Animated.View key={`${year}-${month}`} entering={entering} style={styles.grid}>
        {monthGrid(year, month).map((week, w) => (
          <View key={w} style={styles.row}>
            {week.map((day, i) => {
              if (day === null) return <View key={i} style={styles.cell} />;
              const iso = isoFor(year, month, day);
              const disabled = iso < min || iso > max;
              const selected = iso === value;
              const isToday = iso === today;
              const label = new Date(year, month, day).toLocaleDateString('en-PH', {
                month: 'long',
                day: 'numeric',
              });
              return (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={`${WEEKDAY_NAMES[i] ?? ''}, ${label}${isToday ? ', today' : ''}`}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => {
                    haptics.selection();
                    onChange(iso);
                  }}
                  style={styles.cell}
                >
                  {selected ? (
                    <Animated.View
                      entering={
                        reduceMotion
                          ? undefined
                          : ZoomIn.springify()
                              .damping(springs.snappy.damping)
                              .stiffness(springs.snappy.stiffness)
                      }
                      style={[styles.selected, { backgroundColor: theme.primary }]}
                    />
                  ) : null}
                  <AppText
                    variant="body"
                    numeric
                    tone={selected ? 'onPrimary' : disabled ? 'subtle' : 'default'}
                    style={disabled ? styles.disabled : null}
                  >
                    {day}
                  </AppText>
                  {isToday && !selected ? (
                    <View style={[styles.todayDot, { backgroundColor: theme.accent }]} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nav: { flexDirection: 'row' },
  grid: { gap: 2 },
  row: { flexDirection: 'row' },
  weekday: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  cell: { flex: 1, height: CELL, alignItems: 'center', justifyContent: 'center' },
  selected: {
    position: 'absolute',
    width: CELL - 4,
    height: CELL - 4,
    borderRadius: radius.pill,
  },
  disabled: { opacity: 0.5 },
  todayDot: { position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: radius.pill },
});
