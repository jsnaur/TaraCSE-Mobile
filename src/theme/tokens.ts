import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Colour roles. Components read these through `useTheme()` and never use raw hex values.
 *
 * Light mode sits on warm paper rather than pure white so the navy ink and the single
 * amber accent read as print, not as a default UI kit. Dark mode is a deep navy night,
 * not grey, so the brand survives the switch.
 */
export interface ColorRoles {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  onSurface: string;
  onSurfaceMuted: string;
  onSurfaceSubtle: string;
  border: string;
  borderStrong: string;
  primary: string;
  onPrimary: string;
  primaryTint: string;
  accent: string;
  onAccent: string;
  accentTint: string;
  success: string;
  successTint: string;
  danger: string;
  dangerTint: string;
  warning: string;
  warningTint: string;
  scrim: string;
  /** Navy hero surface (Home's exam card, Welcome's panel) and the text that sits on it. */
  ink: string;
  onInk: string;
  onInkMuted: string;
  /** Floating tab bar family. Bar content must use these, never the page roles. */
  navBar: string;
  onNavBarMuted: string;
  navBarPill: string;
  onNavBarPill: string;
}

export const lightColors: ColorRoles = {
  background: '#F6F4EF',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#EEEBE3',
  onSurface: '#111A30',
  onSurfaceMuted: '#545D72',
  onSurfaceSubtle: '#858B9B',
  border: '#E3DFD5',
  borderStrong: '#CFCABD',
  primary: '#1B3577',
  onPrimary: '#FFFFFF',
  primaryTint: '#E5EAF4',
  accent: '#F5A800',
  onAccent: '#0F1D3E',
  accentTint: '#FCEFCB',
  success: '#1D7F54',
  successTint: '#E1F2E8',
  danger: '#C2362C',
  dangerTint: '#FAE5E2',
  warning: '#A86400',
  warningTint: '#FBEBD2',
  scrim: 'rgba(10, 16, 32, 0.45)',
  ink: '#1B3577',
  onInk: '#FFFFFF',
  onInkMuted: 'rgba(255, 255, 255, 0.7)',
  navBar: '#13214A',
  onNavBarMuted: '#94A0BF',
  navBarPill: '#F5A800',
  onNavBarPill: '#0F1D3E',
};

export const darkColors: ColorRoles = {
  background: '#0A0F1E',
  surface: '#121A2E',
  surfaceRaised: '#19223A',
  surfaceSunken: '#0D1426',
  onSurface: '#EDF0F7',
  onSurfaceMuted: '#A3ABC0',
  onSurfaceSubtle: '#6F7891',
  border: '#232C45',
  borderStrong: '#323D5C',
  primary: '#4A7BC8',
  onPrimary: '#0A0F1E',
  primaryTint: '#18284A',
  accent: '#FFB300',
  onAccent: '#0F1D3E',
  accentTint: '#3A2D0C',
  success: '#45C28A',
  successTint: '#12301F',
  danger: '#F06A5E',
  dangerTint: '#3A1714',
  warning: '#F0A43A',
  warningTint: '#3A2810',
  scrim: 'rgba(0, 0, 0, 0.6)',
  ink: '#19223A',
  onInk: '#EDF0F7',
  onInkMuted: '#A3ABC0',
  navBar: '#1B2540',
  onNavBarMuted: '#8D97B2',
  navBarPill: '#FFB300',
  onNavBarPill: '#0F1D3E',
};

export const fonts = {
  displayBold: 'SpaceGrotesk_700Bold',
  displaySemiBold: 'SpaceGrotesk_600SemiBold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export type TypeVariant = 'display' | 'title' | 'headline' | 'body' | 'label' | 'caption';

interface TypeSpec {
  style: TextStyle;
  /** Caps how far the system font scale may grow this variant. */
  maxScale: number;
}

export const typography: Record<TypeVariant, TypeSpec> = {
  display: {
    style: { fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 38, letterSpacing: -0.8 },
    maxScale: 1.3,
  },
  title: {
    style: { fontFamily: fonts.displaySemiBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
    maxScale: 1.4,
  },
  headline: {
    style: { fontFamily: fonts.bodySemiBold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
    maxScale: 1.6,
  },
  body: {
    style: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, letterSpacing: -0.1 },
    maxScale: 1.8,
  },
  label: {
    style: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
    maxScale: 1.6,
  },
  caption: {
    style: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
    maxScale: 1.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

/** Side gutter for every screen. */
export const gutter = spacing.xl - 4;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/** Android minimum touch target. */
export const minTouch = 48;

export const springs = {
  /** Presses, toggles, small state flips. */
  snappy: { damping: 22, stiffness: 320, mass: 0.7 },
  /** Position indicators and sheets. Low bounce. */
  gentle: { damping: 18, stiffness: 180, mass: 0.7 },
  /** Celebrations only: score reveal, goal complete. */
  bouncy: { damping: 11, stiffness: 200, mass: 0.9 },
} as const;

export const durations = {
  fast: 140,
  base: 240,
  slow: 420,
  /** Number tickers and drawn-in rings. */
  reveal: 900,
} as const;

function shadow(level: 1 | 2 | 3, dark: boolean): ViewStyle {
  const opacity = dark ? [0.35, 0.45, 0.55][level - 1]! : [0.05, 0.08, 0.14][level - 1]!;
  const blur = [6, 14, 24][level - 1]!;
  const y = [1, 4, 10][level - 1]!;
  return Platform.select<ViewStyle>({
    android: { elevation: [1, 4, 10][level - 1]! },
    web: { boxShadow: `0px ${y}px ${blur}px rgba(10, 16, 32, ${opacity})` } as ViewStyle,
    default: {
      shadowColor: '#0A1020',
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
      shadowOffset: { width: 0, height: y },
    },
  });
}

export function elevationFor(dark: boolean) {
  return { level1: shadow(1, dark), level2: shadow(2, dark), level3: shadow(3, dark) };
}

export type Elevation = ReturnType<typeof elevationFor>;
