const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/', // ✅ default untuk local (akan di-overwrite di prod)
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
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
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/public/icons', to: 'icons' },
        { from: 'src/public/images', to: 'images' },
        { from: 'src/public/manifest.json', to: 'manifest.json' },
        { from: 'src/public/sw.js', to: 'sw.js' },
        { from: 'src/public/fallback.html', to: 'fallback.html' },
        { from: 'src/public/favicon.png', to: 'favicon.png' },
      ],
    }),
  ],
};
