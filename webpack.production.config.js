const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const dist = path.resolve(__dirname, 'www');
var entryPath = path.resolve(__dirname, 'frontend', 'app.js');
const nodePath = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    app: entryPath
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin([dist]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      underscore: "underscore",
      _: "underscore",
      Popper: ['popper.js', 'default'],
      Clipboard: 'clipboard.js',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ],
  module: {
    rules: [
    {
      test: /\.js$/,
      use: ['ng-annotate-loader', 'strip-loader?strip[]=debug', 'babel-loader'],
      include: [
        path.resolve(__dirname, "node_modules/clipboard/src")
      ],
      exclude: [nodePath]
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    },
    {
      test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader"
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        'file-loader?name=images/[name].[ext]',
        'image-webpack-loader?bypassOnDebug'
      ]
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(scss|sass)$/,
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      },
      {
        loader: 'sass-loader'
      }
      ]
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, dist)
  }
};