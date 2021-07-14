const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const devServerSetup = require('./webpack.config.devserver')
const path = require('path');

module.exports = merge(common, {
  output: {
    publicPath: 'http://localhost:8081/',
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    open: false,
    port: 8080,
    host: '0.0.0.0',
    setup: devServerSetup,
    disableHostCheck: true,
  },
});

