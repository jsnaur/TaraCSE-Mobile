import { Eye, EyeOff } from 'lucide-react-native';
import { useState, type ComponentRef, type Ref } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { fonts, minTouch, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  hint?: string;
  error?: string;
  /** Adds a show/hide toggle and hides the value by default. */
  password?: boolean;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

export function TextField({
  label,
  hint,
  error,
  password = false,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextFieldProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);
  const borderColor = error ? theme.danger : focused ? theme.primary : theme.border;

  return (
    <View style={styles.wrap}>
      <AppText variant="label" weight="medium">
        {label}
      </AppText>
      <View
        style={[
          styles.field,
          { borderColor, backgroundColor: theme.surface, borderWidth: focused || error ? 2 : 1 },
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          placeholderTextColor={theme.onSurfaceSubtle}
          selectionColor={theme.primary}
          secureTextEntry={hidden}
          maxFontSizeMultiplier={typography.body.maxScale}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: theme.onSurface }]}
          {...rest}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}
            style={styles.eye}
          >
            {hidden ? (
              <Eye size={20} color={theme.onSurfaceMuted} />
            ) : (
              <EyeOff size={20} color={theme.onSurfaceMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="muted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: minTouch + 6,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  eye: { paddingHorizontal: spacing.lg, height: minTouch, justifyContent: 'center' },
});
