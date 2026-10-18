import { router } from 'expo-router';
import { Bookmark, Flame, Swords } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { weakestTopics } from '@/lib/mastery';
import { lastSession, todayStats } from '@/mocks/progress';
import { useProfile } from '@/state/session';
import { gutter, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { ContinueCard } from './ContinueCard';
import { ExamHeroCard } from './ExamHeroCard';
import { FocusTopics } from './FocusTopics';

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const profile = useProfile();
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const firstName = profile.name.split(' ')[0] ?? profile.name;
  const weak = weakestTopics(profile.level, 3);
  const today = new Date()
    .toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();

  // Sections rise in one after another on first mount; skipped under reduce motion.
  const enter = (i: number) =>
    reduceMotion
      ? undefined
      : FadeInDown.delay(60 * i)
          .springify()
          .damping(20)
          .stiffness(180);

  return (
    <Screen
      tabRoot
      header={
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrowRow}>
              <AppText variant="caption" tone="muted" style={styles.eyebrow}>
                {today}
              </AppText>
              <View
                style={[styles.streak, { backgroundColor: theme.accentTint }]}
                accessible
                accessibilityLabel={`${todayStats.streakDays} day streak`}
              >
                <Flame size={12} color={theme.warning} strokeWidth={2.6} fill={theme.accent} />
                <AppText variant="caption" numeric weight="semibold">
                  {todayStats.streakDays}-day streak
                </AppText>
              </View>
            </View>
            <AppText variant="title" accessibilityRole="header" numberOfLines={1}>
              {greeting()}, {firstName}
            </AppText>
          </View>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={() => router.push('/profile')}
            pressedScale={0.92}
          >
            <Avatar name={profile.name} size={40} />
          </PressableScale>
        </View>
      }
    >
      <Animated.View entering={enter(0)} style={styles.first}>
        <ExamHeroCard profile={profile} answeredToday={todayStats.answeredToday} />
      </Animated.View>

      <Animated.View entering={enter(1)}>
        <SectionHeader title="Pick up where you left off" />
        <ContinueCard session={lastSession} />
      </Animated.View>

      {weak.length > 0 ? (
        <Animated.View entering={enter(2)}>
          <SectionHeader
            title="Worth another look"
            actionLabel="All topics"
            onAction={() => router.push('/practice')}
          />
          <FocusTopics rows={weak} />
        </Animated.View>
      ) : null}

      <Animated.View entering={enter(3)}>
        <SectionHeader title="More ways to review" />
        <Card padding={0}>
          <ListRow
            icon={Swords}
            title="Quiz Duel"
            subtitle="10 questions against another reviewee"
            onPress={() => router.push('/duel')}
          />
          <ListRow
            icon={Bookmark}
            title="Bookmarks"
            subtitle="Questions you saved for later"
            onPress={() => router.push('/bookmarks')}
            showDivider={false}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: { flex: 1, gap: 2 },
  eyebrow: { letterSpacing: 1.1 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  first: { marginTop: spacing.xs },
});
