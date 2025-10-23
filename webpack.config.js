const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    main: './src/tests/main.ts',
    'main-refactored': './src/tests/main-refactored.ts',
    'auth.test': './src/tests/scenarios/auth.test.ts',
    'contacts.test': './src/tests/scenarios/contacts.test.ts',
    'negative-auth.test': './src/tests/scenarios/negative-auth.test.ts',
    'negative-contacts.test': './src/tests/scenarios/negative-contacts.test.ts',
    'load-test': './src/tests/load-test.ts',
    'stress-test': './src/tests/stress-test.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  devtool: 'source-map',
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
