import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gutter, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Height the floating tab bar occupies, so tab screens can clear it. */
export const TAB_BAR_CLEARANCE = 60 + spacing.lg * 2;

export interface ScreenProps {
  children: ReactNode;
  /** Header rendered above the scroll area (stays put). */
  header?: ReactNode;
  /** Sticky footer, e.g. a primary action. Sits above the safe area. */
  footer?: ReactNode;
  scroll?: boolean;
  /** Tab roots leave room for the floating bar. */
  tabRoot?: boolean;
  padded?: boolean;
  /** Skip the top safe-area inset when the header handles it. */
  edgeTop?: boolean;
  tone?: 'background' | 'surface';
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  header,
  footer,
  scroll = true,
  tabRoot = false,
  padded = true,
  edgeTop = true,
  tone = 'background',
  contentStyle,
}: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = tabRoot
    ? insets.bottom + TAB_BAR_CLEARANCE
    : footer
      ? spacing.lg
      : insets.bottom + spacing.xl;
  const content = [
    padded ? { paddingHorizontal: gutter } : null,
    { paddingBottom: bottom },
    contentStyle,
  ];

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: tone === 'surface' ? theme.surface : theme.background },
        edgeTop ? { paddingTop: insets.top } : null,
      ]}
    >
      {header}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, content]}>{children}</View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + spacing.md,
              backgroundColor: tone === 'surface' ? theme.surface : theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
