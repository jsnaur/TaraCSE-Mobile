import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { haptics } from '@/lib/haptics';
import { minTouch, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Right side: a value, badge or switch. A chevron is added when the row navigates. */
  trailing?: ReactNode;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showDivider?: boolean;
  accessibilityHint?: string;
}

/** A ruled row inside a grouped list. Rows separate with hairlines, never with gaps. */
export function ListRow({
  title,
  subtitle,
  icon: Icon,
  trailing,
  value,
  onPress,
  destructive = false,
  showDivider = true,
  accessibilityHint,
}: ListRowProps) {
  const { theme } = useTheme();
  const tint = destructive ? theme.danger : theme.onSurface;

  const content = (pressed: boolean) => (
    <View style={[styles.row, { backgroundColor: pressed ? theme.surfaceSunken : 'transparent' }]}>
      {Icon ? (
        <View
          style={[
            styles.iconWell,
            { backgroundColor: destructive ? theme.dangerTint : theme.surfaceSunken },
          ]}
        >
          <Icon size={18} color={tint} strokeWidth={2} />
        </View>
      ) : null}
      <View
        style={[styles.text, showDivider ? { borderBottomColor: theme.border } : styles.noRule]}
      >
        <View style={styles.textCol}>
          <AppText variant="body" weight="medium" style={{ color: tint }} numberOfLines={2}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="muted" numberOfLines={2}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {value ? (
          <AppText variant="label" tone="muted" numberOfLines={1}>
            {value}
          </AppText>
        ) : null}
        {trailing}
        {onPress && !trailing ? (
          <ChevronRight size={18} color={theme.onSurfaceSubtle} strokeWidth={2} />
        ) : null}
      </View>
    </View>
  );

  if (!onPress) return content(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${title}, ${value}` : title}
      accessibilityHint={accessibilityHint}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    minHeight: minTouch + 8,
  },
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    alignSelf: 'stretch',
  },
  noRule: { borderBottomWidth: 0 },
  textCol: { flex: 1, gap: 2 },
});
