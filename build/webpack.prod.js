const path = require('path');
const {merge} = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
        },
      ],
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
