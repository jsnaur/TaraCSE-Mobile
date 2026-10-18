import { ChevronLeft, Flag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { gutter, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export interface ExamFooterProps {
  flagged: boolean;
  isFirst: boolean;
  isLast: boolean;
  onToggleFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ExamFooter({
  flagged,
  isFirst,
  isLast,
  onToggleFlag,
  onPrev,
  onNext,
}: ExamFooterProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.footer,
        { borderTopColor: theme.border, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <IconButton
        icon={Flag}
        label={flagged ? 'Remove flag' : 'Flag this question'}
        variant="outline"
        selected={flagged}
        onPress={onToggleFlag}
      />
      <IconButton
        icon={ChevronLeft}
        label="Previous question"
        variant="outline"
        disabled={isFirst}
        onPress={onPrev}
      />
      <Button
        label={isLast ? 'Review and submit' : 'Next'}
        size="lg"
        onPress={onNext}
        style={styles.next}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  next: { flex: 1 },
});
