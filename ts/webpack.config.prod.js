const { CheckerPlugin } = require('awesome-typescript-loader');
const { join } = require('path');
const { optimize } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: join(__dirname, 'src/background.ts')
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: join(__dirname, '../dist/assets/ts'),
    filename: '[name].js'
  },
  plugins: [
    new CheckerPlugin(),
    new optimize.AggressiveMergingPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: join(__dirname, 'assets'),
          to: join(__dirname, '../dist/assets/ts/assets')
        }
      ]
    })],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
