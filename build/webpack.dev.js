const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(commonConfig, devConfig);
