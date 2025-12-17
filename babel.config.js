module.exports = function (api) {
  api.cache(true);

  const removeIn = 'production';
  const currentVariant = process.env.EXPO_PUBLIC_APP_VARIANT;
  const shouldRemoveConsole = removeIn.includes(currentVariant);
  const conditionalPlugins = [];

  if (shouldRemoveConsole) {
    conditionalPlugins.push('transform-remove-console');
  }

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ...conditionalPlugins,

      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            'react-native-device-info': './react-native-device-info.js',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};