import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { spacing } from '@/theme/tokens';

export interface PlaceholderLink {
  label: string;
  href: Href;
  replace?: boolean;
}

export interface PlaceholderScreenProps {
  title: string;
  /** What this screen will hold once designed. */
  note: string;
  links?: PlaceholderLink[];
  /** Buttons that change fake session state (sign in, sign out, finish onboarding). */
  actions?: { label: string; onPress: () => void }[];
  back?: 'back' | 'close' | false;
  tabRoot?: boolean;
}

/**
 * Temporary stand-in so every route exists and is reachable by taps. Each one is
 * replaced by a designed screen; delete this component when none remain.
 */
export function PlaceholderScreen({
  title,
  note,
  links = [],
  actions = [],
  back = 'back',
  tabRoot = false,
}: PlaceholderScreenProps) {
  return (
    <Screen
      tabRoot={tabRoot}
      header={
        tabRoot ? <ScreenHeader large title={title} /> : <ScreenHeader title={title} back={back} />
      }
    >
      <View style={styles.body}>
        <AppText variant="body" tone="muted">
          {note}
        </AppText>
        {links.length > 0 ? (
          <Card padding={0}>
            {links.map((link, i) => (
              <ListRow
                key={`${link.label}-${i}`}
                title={link.label}
                showDivider={i < links.length - 1}
                onPress={() => (link.replace ? router.replace(link.href) : router.push(link.href))}
              />
            ))}
          </Card>
        ) : null}
        {actions.map((action) => (
          <Button key={action.label} label={action.label} onPress={action.onPress} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingTop: spacing.md },
});
