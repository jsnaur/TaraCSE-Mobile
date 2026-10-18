import { Lock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

/**
 * Exact copy required by docs/PLAY_STORE.md. Do not reword, and never add a call to
 * action, a price or a pointer to the website next to it.
 */
export const LOCKED_COPY = 'Not included in your current plan.';

export interface LockedSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Name of the locked feature, stated neutrally. */
  title: string;
}

/** The only response to tapping a premium-only item on a free account. */
export function LockedSheet({ visible, onClose, title }: LockedSheetProps) {
  const { theme } = useTheme();
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.sheet}>
        <View style={[styles.lock, { backgroundColor: theme.surfaceSunken }]}>
          <Lock size={22} color={theme.onSurface} strokeWidth={2} />
        </View>
        <AppText variant="headline" align="center">
          {title}
        </AppText>
        <AppText variant="body" tone="muted" align="center">
          {LOCKED_COPY}
        </AppText>
        <Button label="Got it" variant="secondary" onPress={onClose} style={styles.got} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: { alignItems: 'center', gap: spacing.sm, paddingBottom: spacing.sm },
  lock: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  got: { alignSelf: 'center', marginTop: spacing.md },
});
