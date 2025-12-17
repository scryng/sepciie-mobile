import { vars } from 'nativewind';

export type Theme = 'light' | 'dark';

export type ThemeColor = keyof (typeof themeColors)[Theme];

export const themeColors = {
  light: {
    // Basic colors
    '--color-bandw': '#000000',

    // Background colors
    '--color-background': '#FFFFFF',
    '--color-background-secondary': '#F8FAFC',
    '--color-background-muted': '#F1F5F9',
    '--color-surface': '#f9f9f9',
    '--color-card': '#F1F5F9',
    '--color-card-secondary': '#CBD5E1',
    '--color-header': '#FFFFFF',

    // Foreground/Text colors
    '--color-foreground': '#1E293B',
    '--color-foreground-secondary': '#334155',
    '--color-foreground-muted': '#64748B',
    '--color-text': '#1E293B',
    '--color-text-muted': '#64748B',
    '--color-card-foreground': '#1E293B',
    '--color-text-button-primary': '#FFFFFF',

    // Border and input colors
    '--color-border': '#E2E8F0',
    '--color-input': '#fff',
    '--color-input-border': '#E2E8F0',
    '--color-ring': '#3B82F6',

    '--color-primary': '#242854',
    '--color-primary-foreground': '#FFFFFF',
    '--color-secondary': '#F1F5F9',
    '--color-secondary-foreground': '#1E293B',

    // Status colors
    '--color-success': '#10B981',
    '--color-warning': '#F59E0B',
    '--color-warning-40': '#F59E0B40',
    '--color-error': '#EF4444',
    '--color-danger': '#EF4444',
    '--color-info': '#3B82F6',
    '--color-accent': '#ffa117',


    // Status bar
    '--status-bar-style': 'dark-content',
    '--status-bar-bg': '#FFFFFF',

    // Button Colors
    '--color-button-action': '#242854',
    '--color-button-activate': '#16a34a',
    '--color-button-deactivate': '#dc2626',
    '--color-button-edit': '#ff9f00',
    '--color-button-delete': '#ff5e5e',
    '--color-button-cancel': '#e5e7eb',

    '--color-status-active': '#3ac977',
    '--color-status-inactive': '#ff154a',

    '--color-spinner': '#4A90E2',
  } as const,

  dark: {
    // Basic colors
    '--color-bandw': '#FFFFFF',

    // Background colors
    '--color-background': '#0F172A',
    '--color-background-secondary': '#1E293B',
    '--color-background-muted': '#334155',
    '--color-surface': '#1E293B',
    '--color-card': '#1E293B',
    '--color-card-secondary': '#374151',
    '--color-header': '#0F172A',

    // Foreground/Text colors
    '--color-foreground': '#F1F5F9',
    '--color-foreground-secondary': '#E2E8F0',
    '--color-foreground-muted': '#94A3B8',
    '--color-text': '#F1F5F9',
    '--color-text-muted': '#94A3B8',
    '--color-card-foreground': '#F1F5F9',
    '--color-text-button-primary': '#0F172A',

    // Border and input colors
    '--color-border': '#334155',
    '--color-input': '#334155',
    '--color-input-border': '#475569',
    '--color-ring': '#60A5FA',

    '--color-primary': '#B1B9FF',
    '--color-primary-foreground': '#1E293B',
    '--color-secondary': '#334155',
    '--color-secondary-foreground': '#F1F5F9',

    // Status colors
    '--color-success': '#34D399',
    '--color-warning': '#FBBF24',
    '--color-warning-40': '#FBBF2440',
    '--color-error': '#F87171',
    '--color-danger': '#F87171',
    '--color-info': '#60A5FA',
    '--color-accent': '#ffa117',


    // Status bar
    '--status-bar-style': 'light-content',
    '--status-bar-bg': '#0F172A',

    // Button Colors
    '--color-button-action': '#B1B9FF',
    '--color-button-activate': '#57d887',
    '--color-button-deactivate': '#df3b3b',
    '--color-button-edit': '#cc7f00',
    '--color-button-delete': '#940000',
    '--color-button-cancel': '#25282a',

    '--color-status-active': '#4dce84',
    '--color-status-inactive': '#df3b3b',
    '--color-spinner': '#4A90E2',
  } as const,
};

export const themes = {
  app: {
    light: vars(themeColors.light),
    dark: vars(themeColors.dark),
  },
};

export const getThemeValue = (variable: string, colorScheme: 'light' | 'dark' = 'light') => {
  const theme = themes.app[colorScheme];
  return theme[variable] || null;
};
