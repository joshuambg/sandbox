const path = require('path');
const webpack = require('webpack');

const config = {
  stats: {
    maxModules: 0
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',

  entry: [
    './src/main.jsx',
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },

  // context: path.resolve(__dirname, 'app'),

  devServer: {
    publicPath: '/',
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    open: false,
    port: 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.scss$/,
      //   // exclude: /node_modules/,
      //   use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       'css-loader',
      //       {
      //         loader: 'sass-loader',
      //         query: {
      //           sourceMap: false,
      //         },
      //       },
      //     ],
      //     publicPath: '../'
      //   })),
      // },
    ]
  },

  plugins: [
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'static/index.html'), to: 'index.html' }])
  ]
};

module.exports = config;
