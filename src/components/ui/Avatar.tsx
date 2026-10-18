import { StyleSheet, View } from 'react-native';

import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

export interface AvatarProps {
  name: string;
  size?: number;
  /** Highlight ring, e.g. the current user in a ranking. */
  ring?: boolean;
}

/** Initials avatar. Tint is picked from the name so the same person keeps one colour. */
export function Avatar({ name, size = 40, ring = false }: AvatarProps) {
  const { theme } = useTheme();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  const tints = [theme.primaryTint, theme.accentTint, theme.successTint, theme.surfaceSunken];
  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const bg = tints[hash % tints.length] ?? theme.surfaceSunken;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderWidth: ring ? 2 : 0,
          borderColor: theme.accent,
        },
      ]}
    >
      <AppText
        variant="label"
        style={{
          fontFamily: fonts.displaySemiBold,
          fontSize: size * 0.38,
          lineHeight: size * 0.46,
        }}
      >
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
