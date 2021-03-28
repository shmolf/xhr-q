const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    xhrQ: './src/xhrQ.js',
    'xhrQ.min': './src/xhrQ.js',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
          parallel: true,
          include: /\.min\.js$/
      }),
    ],
  },
};
