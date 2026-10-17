import type { ReactNode } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useStagger } from '@/hooks/useStagger';
import { spacing } from '@/theme/tokens';

export interface AuthScaffoldProps {
  title: string;
  subtitle?: ReactNode;
  /** Sits beside the title, e.g. a small KOT. */
  aside?: ReactNode;
  children: ReactNode;
  /** Sticky full-width action; it rides above the keyboard. */
  action: Pick<ButtonProps, 'label' | 'onPress' | 'loading' | 'disabled' | 'variant'>;
  /** Quiet text button under the action, e.g. switching between log in and sign up. */
  link?: { label: string; onPress: () => void };
}

/**
 * Shared frame for the signed-out forms: a back button, a large left-aligned title,
 * the fields, and a sticky action that stays reachable while the keyboard is up.
 */
export function AuthScaffold({
  title,
  subtitle,
  aside,
  children,
  action,
  link,
}: AuthScaffoldProps) {
  const enter = useStagger();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <Screen
        header={<ScreenHeader back="back" />}
        footer={
          <View style={styles.footer}>
            <Button size="lg" fullWidth {...action} />
            {link ? (
              <Button
                label={link.label}
                variant="ghost"
                style={styles.center}
                onPress={link.onPress}
              />
            ) : null}
          </View>
        }
      >
        <Animated.View entering={enter(0)} style={styles.head}>
          <View style={styles.headText}>
            <AppText variant="display" accessibilityRole="header">
              {title}
            </AppText>
            {typeof subtitle === 'string' ? (
              <AppText variant="body" tone="muted">
                {subtitle}
              </AppText>
            ) : (
              subtitle
            )}
          </View>
          {aside}
        </Animated.View>
        <Animated.View entering={enter(1)} style={styles.body}>
          {children}
        </Animated.View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  headText: { flex: 1, gap: spacing.sm },
  body: { gap: spacing.lg },
  footer: { gap: spacing.xs },
  center: { alignSelf: 'center' },
});
