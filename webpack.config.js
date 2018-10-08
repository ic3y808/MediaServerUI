var Webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');
var path = require('path');
var assetsPath = path.resolve(__dirname, 'public', 'assets');
var entryPath = path.resolve(__dirname, 'frontend', 'app.es6.js');
var host = process.env.APP_HOST || 'localhost';

var config = {

  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  entry: [

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://' + host + ':3001',

    // Our application
    entryPath
  ],
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      modules: path.join(__dirname, "node_modules")
    }
  },
  module: {
    loaders: [{
        test: /\.es6.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?sourceMap')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?sourceMap!less?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
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
    new Webpack.HotModuleReplacementPlugin(),
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
    })
  ]
};

module.exports = config;