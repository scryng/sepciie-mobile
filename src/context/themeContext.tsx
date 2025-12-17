// src/context/themeContext.tsx
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { ThemeColor, themeColors, themes } from '@/utils/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
type Mode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  mode: Mode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: Mode) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextData>({
  mode: 'system',
  resolvedMode: 'light',
  setMode: () => {},
  isReady: false,
});

const STORAGE_KEY = STORAGE_KEYS.theme;

const isValidMode = (v: string | null): v is Mode => v === 'light' || v === 'dark' || v === 'system';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useNativeWindScheme();
  const [mode, setMode] = useState<Mode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (isValidMode(stored)) setMode(stored);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const resolvedMode = useMemo<'light' | 'dark'>(() => {
    const system = colorScheme ?? 'light';
    return mode === 'system' ? system : mode;
  }, [mode, colorScheme]);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
    setColorScheme(resolvedMode);
  }, [mode, resolvedMode, setColorScheme, isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (mode === 'system') setColorScheme(resolvedMode);
  }, [colorScheme, mode, resolvedMode, setColorScheme, isReady]);

  const handleSetMode = (newMode: Mode) => setMode(newMode);

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, setMode: handleSetMode, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode deve ser usado dentro de um ThemeProvider');
  return ctx;
};

export function useThemeColors(): Record<ThemeColor, string> {
  const { resolvedMode } = useThemeMode();
  return themeColors[resolvedMode];
}
