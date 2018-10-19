const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
//const MinifyPlugin = require("babel-minify-webpack-plugin");
const ControllerHotLoader = require.resolve('./loaders/controller-loader');
const ServiceHotLoader = require.resolve('./loaders/service-loader');
const JadeHotLoader = require.resolve('./loaders/jade-loader');
const webpack = require('webpack');
const dist = path.resolve(__dirname, 'dist');
const nodePath = path.resolve(__dirname, 'node_modules');

var profile = {

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      //underscore: "underscore",
      //_: "underscore",
      //Popper: ['popper.js', 'default'],
      //Clipboard: 'clipboard.js',
      //Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      //Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      //Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      //Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      //Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      //Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      //Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      //Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      //Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      //Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    new webpack.DefinePlugin({
      "DEV_MODE": process.env.DEV,
      "SERVER_HOST": process.env.SERVER_HOST,
      "SERVER_PORT": process.env.PORT
    })
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

if (process.env.DEV === 'true') {
  profile.entry = {
    app: ['./frontend/app.js', 'webpack-hot-middleware/client']
  };
  profile.devtool = 'inline-source-map';
  profile.plugins.push(new CleanWebpackPlugin([dist]));
  profile.module.rules.push({
    test: /\.jade$/,
    enforce: "post",
    loader: JadeHotLoader,
    exclude: [nodePath]
  });
  profile.module.rules.push({
    test: /\.component.js$/,
    enforce: "pre",
    loader: ControllerHotLoader,
    exclude: [nodePath]
  });
  profile.module.rules.push({
    test: /\.service.js$/,
    enforce: "pre",
    loader: ServiceHotLoader,
    exclude: [nodePath]
  });
  profile.plugins.push(new CleanWebpackPlugin([dist]));
  profile.plugins.push(new webpack.HotModuleReplacementPlugin());
  profile.plugins.push(new LiveReloadPlugin({
    port: process.env.LIVE_RELOAD_PORT
  }));

} else {
  profile.entry = {
    app: ['./frontend/app.js']
  };

}



module.exports = profile;