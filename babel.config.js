module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
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
        alias: {
          screens: './src/screens',
          navigation: './src/navigation',
          components: './src/components',
          actions: './src/actions',
          theme: './src/theme',
          utils: './src/utils',
          images: './src/assets/images',
          data: './src/assets/data',
          i18n: './src/i18n',
        },
      },
    ],
  ],
};
