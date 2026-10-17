import { router } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { daysUntil, formatExamDate, levelLabel } from '@/lib/mastery';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Profile } from '@/types/user';

export interface ExamHeroCardProps {
  profile: Profile;
  answeredToday: number;
}

/**
 * The one ink surface on Home: days to the exam on the left, today's goal ring on the
 * right. The amber ring is the only filled accent on the screen.
 */
export function ExamHeroCard({ profile, answeredToday }: ExamHeroCardProps) {
  const { theme, isDark } = useTheme();
  const onInk = isDark ? theme.onSurface : theme.onPrimary;
  const onInkMuted = isDark ? theme.onSurfaceMuted : 'rgba(255,255,255,0.68)';
  const days = profile.examDate ? Math.max(0, daysUntil(profile.examDate)) : null;
  const goal = profile.dailyGoal;
  const goalDone = answeredToday >= goal;

  return (
    <Card
      tone="ink"
      padding="xl"
      onPress={() => router.push('/settings')}
      accessibilityLabel={
        days !== null
          ? `${days} days to your exam. ${answeredToday} of ${goal} questions done today.`
          : `Set your exam date. ${answeredToday} of ${goal} questions done today.`
      }
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <AppText variant="caption" style={[styles.overline, { color: onInkMuted }]}>
            {levelLabel(profile.level).toUpperCase()} EXAM
          </AppText>
          {days !== null ? (
            <>
              <View style={styles.countRow}>
                <NumberTicker
                  value={days}
                  variant="display"
                  style={[styles.count, { color: onInk }]}
                  delay={150}
                />
                <AppText variant="headline" style={{ color: onInk }}>
                  {days === 1 ? 'day to go' : 'days to go'}
                </AppText>
              </View>
              <View style={styles.dateRow}>
                <CalendarDays size={14} color={onInkMuted} strokeWidth={2} />
                <AppText variant="caption" style={{ color: onInkMuted }}>
                  {formatExamDate(profile.examDate ?? '')}
                </AppText>
              </View>
            </>
          ) : (
            <AppText variant="title" style={{ color: onInk, marginTop: spacing.xs }}>
              Set your exam date
            </AppText>
          )}
        </View>

        <ProgressRing
          value={answeredToday / goal}
          size={96}
          stroke={9}
          tone="accent"
          onInk
          sweep={0.78}
          delay={350}
          accessibilityLabel={`Daily goal, ${answeredToday} of ${goal}`}
        >
          <AppText variant="headline" numeric style={{ color: onInk }}>
            {Math.min(answeredToday, goal)}
          </AppText>
          <AppText variant="caption" numeric style={{ color: onInkMuted, marginTop: -2 }}>
            of {goal}
          </AppText>
        </ProgressRing>
      </View>
      <View style={[styles.footer, { borderTopColor: 'rgba(255,255,255,0.12)' }]}>
        <AppText variant="label" style={{ color: onInkMuted }}>
          {goalDone
            ? "Today's goal is done. Anything extra is a bonus."
            : `${goal - answeredToday} more questions to hit today's goal`}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  left: { flex: 1, gap: spacing.xs },
  overline: { letterSpacing: 1.2 },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  count: { fontSize: 56, lineHeight: 60, letterSpacing: -2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },
});
