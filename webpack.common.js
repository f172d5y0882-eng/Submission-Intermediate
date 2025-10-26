const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    // generate index.html dengan path yang sesuai (dev / prod)
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      publicPath: process.env.PUBLIC_URL || '/', // 👈 ini penting biar %PUBLIC_URL% diganti
    }),

    // copy file statis (manifest.json, favicon, icons, dll)
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/public/manifest.json'), to: '' },
        { from: path.resolve(__dirname, 'src/public/favicon.png'), to: '' },
        { from: path.resolve(__dirname, 'src/public/icons'), to: 'icons' },
        { from: path.resolve(__dirname, 'src/public/images'), to: 'images' },
        { from: path.resolve(__dirname, 'src/public/fallback.html'), to: '' },
      ],
    }),


  ],
};
