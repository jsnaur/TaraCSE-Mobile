import { LayoutGrid, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { haptics } from '@/lib/haptics';
import type { ClockTone } from '@/lib/mockExam';
import { gutter, minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { ExamClock } from './ExamClock';

export interface ExamTopBarProps {
  position: number;
  total: number;
  answered: number;
  remainingSec: number;
  tone: ClockTone;
  onLeave: () => void;
  onOpenMap: () => void;
}

export function ExamTopBar({
  position,
  total,
  answered,
  remainingSec,
  tone,
  onLeave,
  onOpenMap,
}: ExamTopBarProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <IconButton icon={X} label="Leave exam" onPress={onLeave} />
        <View style={styles.center}>
          <ExamClock remainingSec={remainingSec} tone={tone} />
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Question ${position} of ${total}. Open the question map`}
          pressedScale={0.94}
          onPress={() => {
            haptics.selection();
            onOpenMap();
          }}
          style={[styles.map, { borderColor: theme.border, backgroundColor: theme.surface }]}
        >
          <LayoutGrid size={16} color={theme.onSurface} strokeWidth={2.2} />
          <AppText variant="label" weight="semibold" numeric>
            {position}
          </AppText>
          <AppText variant="label" tone="subtle" numeric>
            {`/${total}`}
          </AppText>
        </PressableScale>
      </View>
      <View style={styles.progress}>
        <ProgressBar
          value={answered / Math.max(1, total)}
          height={3}
          tone="primary"
          accessibilityLabel={`${answered} of ${total} answered`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  center: { flex: 1, alignItems: 'center' },
  map: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  progress: { paddingHorizontal: gutter },
});
