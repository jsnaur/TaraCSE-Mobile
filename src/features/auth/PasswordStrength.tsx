import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { passwordRules, passwordStrength, strengthLabel, type Strength } from '@/lib/credentials';
import { durations, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const SEGMENTS = [1, 2, 3] as const;

/**
 * Live strength read-out under a new-password field: a three-step meter that fills and
 * recolours as rules are met, then the rules themselves, each ticking off in place.
 */
export function PasswordStrength({ value }: { value: string }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const strength = passwordStrength(value);
  const rules = passwordRules(value);
  const colors: Record<Strength, string> = {
    0: theme.border,
    1: theme.danger,
    2: theme.warning,
    3: theme.success,
  };
  const color = colors[strength];
  const transition = { transitionDuration: reduceMotion ? 0 : durations.base };

  return (
    <View style={styles.wrap}>
      <View
        style={styles.meterRow}
        accessible
        accessibilityLabel={
          strength ? `Password strength: ${strengthLabel(strength)}` : 'No password yet'
        }
        accessibilityLiveRegion="polite"
      >
        <View style={styles.meter}>
          {SEGMENTS.map((n) => (
            <View key={n} style={[styles.track, { backgroundColor: theme.border }]}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    backgroundColor: color,
                    transform: [{ scaleX: strength >= n ? 1 : 0 }],
                    transitionProperty: ['transform', 'backgroundColor'],
                  },
                  transition,
                ]}
              />
            </View>
          ))}
        </View>
        <AppText variant="caption" weight="semibold" style={[styles.label, { color }]}>
          {strengthLabel(strength)}
        </AppText>
      </View>

      <View style={styles.rules}>
        {rules.map((rule) => (
          <View
            key={rule.id}
            style={styles.rule}
            accessible
            accessibilityLabel={`${rule.label}${rule.required ? '' : ', optional'}: ${
              rule.met ? 'done' : 'not yet'
            }`}
          >
            <Animated.View
              style={[
                styles.dot,
                {
                  borderColor: rule.met ? theme.success : theme.borderStrong,
                  backgroundColor: rule.met ? theme.success : 'transparent',
                  transitionProperty: ['backgroundColor', 'borderColor'],
                },
                transition,
              ]}
            >
              {rule.met ? (
                <Animated.View entering={reduceMotion ? undefined : ZoomIn.springify()}>
                  <Check size={11} color={theme.surface} strokeWidth={3.4} />
                </Animated.View>
              ) : null}
            </Animated.View>
            <AppText variant="caption" tone={rule.met ? 'default' : 'muted'}>
              {rule.label}
              {rule.required ? '' : ' (optional)'}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  meterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  meter: { flex: 1, flexDirection: 'row', gap: spacing.xs },
  track: { flex: 1, height: 4, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { flex: 1, transformOrigin: 'left' },
  label: { minWidth: 44, textAlign: 'right' },
  rules: { gap: spacing.sm },
  rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
