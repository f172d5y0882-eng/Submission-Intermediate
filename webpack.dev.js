// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // inject style
    ],
  },
  devServer: {
    port: 9004,
    historyApiFallback: true,
    static: false,                    // ✅ JANGAN layani file dari /dist saat dev
    devMiddleware: { writeToDisk: false },
    client: { overlay: { errors: true, warnings: true } },
  },
});
