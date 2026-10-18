import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface BadgeProps {
  label: string;
  tone?: 'neutral' | 'primary' | 'accent' | 'success' | 'danger' | 'warning';
  icon?: LucideIcon;
}

export function Badge({ label, tone = 'neutral', icon: Icon }: BadgeProps) {
  const { theme, isDark } = useTheme();
  const map = {
    neutral: { bg: theme.surfaceSunken, fg: theme.onSurfaceMuted },
    primary: { bg: theme.primaryTint, fg: theme.primary },
    accent: { bg: theme.accentTint, fg: isDark ? theme.accent : theme.warning },
    success: { bg: theme.successTint, fg: theme.success },
    danger: { bg: theme.dangerTint, fg: theme.danger },
    warning: { bg: theme.warningTint, fg: theme.warning },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: map.bg }]}>
      {Icon ? <Icon size={12} color={map.fg} strokeWidth={2.6} /> : null}
      <AppText variant="caption" weight="semibold" style={{ color: map.fg }} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});
