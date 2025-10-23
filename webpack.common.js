const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/Submission-Intermediate/',
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
new CopyWebpackPlugin({
  patterns: [
    // Copy semua file di public
    {
      from: path.resolve(__dirname, 'src/public/'),
      to: path.resolve(__dirname, 'dist/'),
    },
    // Copy manifest.json langsung ke root dist
    {
      from: path.resolve(__dirname, 'src/manifest.json'),
      to: path.resolve(__dirname, 'dist/manifest.json'),
    },
   
  ],
}),


  ],
};
