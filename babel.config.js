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

const dotEnvDevelopment = [
  'module:react-native-dotenv',
  {
    moduleName: '@env',
    path: '.env.development',
    blacklist: null,
    whitelist: null,
    safe: false,
    allowUndefined: true,
  },
];

const dotEnvProduction = [
  'module:react-native-dotenv',
  {
    moduleName: '@env',
    path: '.env.production',
    blacklist: null,
    whitelist: null,
    safe: false,
    allowUndefined: true,
  },
];

module.exports = function config(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', moduleResolver],
    env: {
      development: {
        plugins: [dotEnvDevelopment],
      },
      production: {
        plugins: [
          'react-native-paper/babel',
          'transform-remove-console',
          dotEnvProduction,
        ],
      },
    },
  };
};
