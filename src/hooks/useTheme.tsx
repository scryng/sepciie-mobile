// src/components/Theme.tsx (mova para pasta components)
import { useThemeMode } from '@/context/themeContext';
import { themes } from '@/utils/themes';
import React from 'react';
import { StatusBar, View } from 'react-native';

interface ThemeProps {
  name: keyof typeof themes;
  children: React.ReactNode;
}

export default function Theme({ name, children }: ThemeProps) {
  const { resolvedMode } = useThemeMode();

  const currentTheme = themes[name][resolvedMode];

  return (
    <>
      <StatusBar
        barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={resolvedMode === 'dark' ? '#AAA' : '#666'}
      />
      <View style={[{ flex: 1 }, currentTheme]}>{children}</View>
    </>
  );
}
