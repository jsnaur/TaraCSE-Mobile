import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { useStagger } from '@/hooks/useStagger';
import { gutter, minTouch, spacing } from '@/theme/tokens';

import { StepProgress } from './StepProgress';

export interface OnboardingStepProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  action: Pick<ButtonProps, 'label' | 'onPress' | 'disabled'>;
  /** Quiet alternative under the action, e.g. "Not sure yet". */
  link?: { label: string; onPress: () => void };
  /** The first step has nowhere to go back to. */
  canGoBack?: boolean;
}

export function OnboardingStep({
  step,
  title,
  subtitle,
  children,
  action,
  link,
  canGoBack = true,
}: OnboardingStepProps) {
  const enter = useStagger(80);

  return (
    <Screen
      header={
        <View style={styles.header}>
          {canGoBack ? (
            <IconButton icon={ChevronLeft} label="Back" onPress={() => router.back()} />
          ) : (
            <View style={styles.spacer} />
          )}
          <StepProgress step={step} />
          <View style={styles.spacer} />
        </View>
      }
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
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </Animated.View>
      <Animated.View entering={enter(1)} style={styles.body}>
        {children}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: gutter - spacing.md,
    minHeight: 56,
  },
  spacer: { width: minTouch },
  head: { gap: spacing.sm, paddingTop: spacing.md, paddingBottom: spacing.xl },
  body: { gap: spacing.lg },
  footer: { gap: spacing.xs },
  center: { alignSelf: 'center' },
});
