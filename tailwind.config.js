/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Basic colors
        bandw: 'var(--color-bandw)',

        // Background colors
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        'background-muted': 'var(--color-background-muted)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        'card-secondary': 'var(--color-card-secondary)',
        header: 'var(--color-header)',

        // Foreground/Text colors
        foreground: 'var(--color-foreground)',
        'foreground-secondary': 'var(--color-foreground-secondary)',
        'foreground-muted': 'var(--color-foreground-muted)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'card-foreground': 'var(--color-card-foreground)',
        'text-button-primary': 'var(--color-text-button-primary)',

        // Border and input colors
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        'input-border': 'var(--color-input-border)',
        ring: 'var(--color-ring)',

        // Primary colors
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',

        // Status colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        'warning-40': 'var(--color-warning-40)',
        error: 'var(--color-error)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        accent: 'var(--color-accent)',

        // Button Colors
        'button-action': 'var(--color-button-action)',
        'button-edit': 'var(--color-button-edit)',
        'button-delete': 'var(--color-button-delete)',
        'button-activate': 'var(--color-button-activate)',
        'button-deactivate': 'var(--color-button-deactivate)',
        'status-active': 'var(--color-status-active)',
        'status-inactive': 'var(--color-status-inactive)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
