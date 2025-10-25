// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/',               // ✅ LOKAL
    clean: true,
  },
  module: {
    rules: [
      { test: /\.html$/, use: ['html-loader'] },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // ✅ file html ada di src
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/icons', to: 'icons' },
        { from: 'src/images', to: 'images' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/sw.js', to: 'sw.js' },
        { from: 'src/fallback.html', to: 'fallback.html' },
        { from: 'src/favicon.png', to: 'favicon.png' },
      ],
    }),
  ],
};
