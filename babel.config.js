const moduleResolver = [
  'module-resolver',
  {
    alias: {
      '@': './',
    },
    extensions: [
      '.ios.ts',
      '.android.ts',
      '.ts',
      '.ios.tsx',
      '.android.tsx',
      '.tsx',
      '.jsx',
      '.js',
      '.json',
    ],
  },
];

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', moduleResolver],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
