import { createContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, elevationFor, lightColors, type ColorRoles, type Elevation } from './tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeValue {
  theme: ColorRoles;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  elevation: Elevation;
}

export const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const isDark = mode === 'dark' || (mode === 'system' && scheme === 'dark');

  const value = useMemo<ThemeValue>(
    () => ({
      theme: isDark ? darkColors : lightColors,
      isDark,
      mode,
      setMode,
      elevation: elevationFor(isDark),
    }),
    [isDark, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
