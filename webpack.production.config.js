var Webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var assetsPath = path.resolve(__dirname, 'public', 'assets');
var entryPath = path.resolve(__dirname, 'frontend', 'app.es6.js');
var host = process.env.APP_HOST || 'localhost';

var config = {

  // We change to normal source mapping
  devtool: 'source-map',
  entry: entryPath,
  output: {

    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the assetsPath
    // as that points to where the files will eventually be bundled
    // in production
    path: assetsPath,
    filename: 'bundle.js',

    // Everything related to Webpack should go through a assets path,
    // localhost:3000/assets. That makes proxying easier to handle
    publicPath: '/assets/'
  },
  module: {

    loaders: [
      { test: /\.es6.js$/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?sourceMap')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?sourceMap!less?sourceMap')
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "node_modules/clipboard/src")
        ],
        loader: 'strip-loader?strip[]=debug'
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }

    ]
  },
  postcss: [autoprefixer, csswring],

  plugins: [
    // We have to manually add the Hot Replacement plugin when running
    // from Node
    new ExtractTextPlugin("styles.css"),
    new Webpack.ProvidePlugin({
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
    new Webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new StatsPlugin(path.join(__dirname, 'stats.json'), { chunkModules: true })
  ]
};

module.exports = config;