import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useSession, type SessionStatus } from '@/state/session';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Plan } from '@/types/user';

const ROUTES: { group: string; items: [string, Href][] }[] = [
  {
    group: 'Signed out',
    items: [
      ['Welcome', '/welcome'],
      ['Log in', '/login'],
      ['Register', '/register'],
      ['Forgot password', '/forgot-password'],
      ['Check email', '/check-email'],
      ['Reset password', '/reset-password'],
    ],
  },
  {
    group: 'Onboarding',
    items: [
      ['Level', '/level'],
      ['Exam date', '/exam-date'],
      ['Daily goal', '/daily-goal'],
      ['Notifications', '/notifications'],
      ['Done', '/done'],
    ],
  },
  {
    group: 'Signed in',
    items: [
      ['Home', '/home'],
      ['Practice', '/practice'],
      ['Practice setup (Verbal)', '/practice/verbal'],
      ['Practice session', '/practice/session/demo'],
      ['Practice review', '/practice/review/demo'],
      ['Mock', '/mock'],
      ['Mock setup', '/mock/setup'],
      ['Mock topics (Numerical)', '/mock/topics/numerical'],
      ['Mock exam', '/mock/exam/demo'],
      ['Mock results', '/mock/results/demo'],
      ['Mock review', '/mock/review/demo'],
      ['Duel lobby', '/duel'],
      ['Duel matching', '/duel/matching'],
      ['Duel match', '/duel/match/demo'],
      ['Duel result', '/duel/result/demo'],
      ['Progress', '/progress'],
      ['Achievements', '/achievements'],
      ['Leaderboard', '/leaderboard'],
      ['Bookmarks', '/bookmarks'],
      ['Profile', '/profile'],
      ['Settings', '/settings'],
      ['Plan', '/plan'],
      ['Delete account', '/delete-account'],
      ['Suggestions', '/suggestions'],
      ['Terms', '/terms'],
      ['Privacy', '/privacy'],
    ],
  },
  {
    group: 'System',
    items: [
      ['Maintenance', '/maintenance'],
      ['Unknown subject (error state)', '/practice/unknown-subject'],
    ],
  },
];

const STATUS = [
  { value: 'signedOut', label: 'Signed out' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'signedIn', label: 'Signed in' },
] as const;

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
] as const;

const THEMES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

/** Development-only jumper. Screens behind a guard need the matching status first. */
export function DevMenuScreen() {
  const { status, plan, dispatch } = useSession();
  const { mode, setMode } = useTheme();

  return (
    <Screen header={<ScreenHeader title="Dev menu" back="close" />}>
      <View style={styles.controls}>
        <AppText variant="label" tone="muted">
          Session
        </AppText>
        <SegmentedControl<SessionStatus>
          accessibilityLabel="Session status"
          options={STATUS}
          value={status}
          onChange={(s) => dispatch({ type: 'setStatus', status: s })}
        />
        <AppText variant="label" tone="muted">
          Plan
        </AppText>
        <SegmentedControl<Plan>
          accessibilityLabel="Plan"
          options={PLANS}
          value={plan}
          onChange={(p) => dispatch({ type: 'setPlan', plan: p })}
        />
        <AppText variant="label" tone="muted">
          Theme
        </AppText>
        <SegmentedControl
          accessibilityLabel="Theme"
          options={THEMES}
          value={mode}
          onChange={setMode}
        />
      </View>
      {ROUTES.map((section) => (
        <View key={section.group} style={styles.section}>
          <AppText variant="caption" tone="muted" style={styles.group}>
            {section.group.toUpperCase()}
          </AppText>
          <Card padding={0}>
            {section.items.map(([label, href], i) => (
              <ListRow
                key={label}
                title={label}
                showDivider={i < section.items.length - 1}
                onPress={() => router.push(href)}
              />
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: { gap: spacing.sm, marginTop: spacing.sm },
  section: { marginTop: spacing.xl, gap: spacing.sm },
  group: { letterSpacing: 1 },
});
