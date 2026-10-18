import { CircleAlert, CircleCheck } from 'lucide-react-native';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gutter, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

type ToastTone = 'neutral' | 'success' | 'danger';
interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside ToastProvider');
  return show;
}

const VISIBLE_MS = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme, elevation, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: ToastTone = 'neutral') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS);
  }, []);

  const value = useMemo(() => show, [show]);
  const Icon = toast?.tone === 'danger' ? CircleAlert : CircleCheck;
  const iconColor = toast?.tone === 'danger' ? theme.danger : theme.success;
  const bg = isDark ? theme.surfaceRaised : theme.onSurface;
  const fg = isDark ? theme.onSurface : theme.surface;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          key={toast.id}
          entering={reduceMotion ? undefined : FadeInUp.springify().damping(18)}
          exiting={reduceMotion ? undefined : FadeOutUp.duration(160)}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          pointerEvents="none"
          style={[
            styles.toast,
            elevation.level3,
            { top: insets.top + spacing.sm, backgroundColor: bg },
          ]}
        >
          {toast.tone !== 'neutral' ? <Icon size={18} color={iconColor} strokeWidth={2.4} /> : null}
          <AppText variant="label" weight="medium" style={[styles.text, { color: fg }]}>
            {toast.message}
          </AppText>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  text: { flex: 1 },
});
