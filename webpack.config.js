const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    xhrQ: './src/xhrQ.js',
    'xhrQ.min': './src/xhrQ.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'xhrQ',
      type: 'umd',
      export: 'default',
    },
    clean: true,
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
          include: /\.min\.js$/
      }),
    ],
  },
};
