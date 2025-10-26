const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/', // penting: localhost pakai root
  },
  devServer: {
    // Jangan layani folder dist sebagai static overlay — pakai output in-memory saja
    static: false,
    port: 9004,
    historyApiFallback: true,
    open: true,
  },
});
