const path = require('path');
const webpack = require('webpack');
const dist = path.resolve(__dirname, 'dist');
const nodePath = path.resolve(__dirname, 'node_modules');

var config = require("./common/config");
var logger = require("./common/logger");

var profile = {};
profile.plugins = [];
profile.module = {};
profile.module.rules = [];

if (process.env.MODE === 'dev') {
  profile.entry = {
    app: ['./frontend/app.js', 'webpack-hot-middleware/client']
  };
  profile.devtool = 'inline-source-map';
  logger.info('webpack', 'packing dev mode source');
} else {
  profile.devtool = 'cheap-module-source-map';
  profile.entry = {
    app: ['./frontend/app.js']
  };
  logger.info('webpack', 'packing release mode source');
}

// Required plugins 
profile.plugins.push(new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
  lodash: "lodash",
  _: "lodash",
  Popper: ['popper.js', 'default'],
  //Clipboard: 'clipboard.js',
  //Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
  //Button: 'exports-loader?Button!bootstrap/js/dist/button',
  //Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
  //Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
  //Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
  //Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
  //Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
  //Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
  //Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
  //Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
  //Util: 'exports-loader?Util!bootstrap/js/dist/util'
}));

profile.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

profile.plugins.push(new webpack.DefinePlugin({
  "DEV_MODE": process.env.MODE === 'dev',
  "SERVER_HOST": process.env.SERVER_HOST,
  "SERVER_PORT": process.env.PORT,
  "JADE_PORT": process.env.JADE_PORT
}));



// Rules and loaders

profile.module.rules.push({
  test: /\.(png|svg|jpg|gif)$/,
  use: ['file-loader']
});

profile.module.rules.push({
  test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "url-loader",

});

profile.module.rules.push({
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: [
    'file-loader?name=images/[name].[ext]',
    'image-webpack-loader?bypassOnDebug'
  ]
});

profile.module.rules.push({
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
});

profile.module.rules.push({
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
    loader: "sass-loader",
    options: {
      includePaths: [path.join(nodePath, 'compass-mixins', 'lib')]
    }
  },
  {
    loader: 'sass-resources-loader',
    options: {
      resources: ['./frontend/styles/_constants.scss', './frontend/styles/_material-colors.scss', './frontend/styles/_functions.scss', './frontend/styles/_variables.scss', './frontend/styles/_framework.scss']
    }
  }
  ]
});

profile.module.rules.push({
  test: /\.less$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'less-loader',
      options: {
        includePaths: [nodePath]
      }
    }
  ],

});

// Output
profile.output = {
  filename: '[name].js',
  chunkFilename: '[name]-[chunkhash].js',
  path: path.resolve(__dirname, dist)
};



// Dev - Production specific

if (process.env.MODE === 'dev') {

  if (process.env.USE_ANALYZER === 'true') {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    profile.plugins.push(new BundleAnalyzerPlugin());
  }

  const LiveReloadPlugin = require('webpack-livereload-plugin');
  profile.plugins.push(new LiveReloadPlugin({
    port: 1908
  }));
  profile.plugins.push(new webpack.HotModuleReplacementPlugin());

} else {
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  profile.plugins.push(new CleanWebpackPlugin([dist]));

  profile.module.rules.push({
    test: /\.js$/,
    use: [{
      loader: 'strip-loader?strip[]=debug'
    },
    {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-transform-runtime',
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true,
            }
          ],
          "@babel/plugin-proposal-class-properties",
          ["angularjs-annotate", {
            explicitOnly: true
          }],
          ["transform-es2015-arrow-functions", {
            "spec": true
          }]
        ],
        presets: ['@babel/preset-env']
      }
    }
    ],
    exclude: /(node_modules|bower_components|angular-auto-complete\.js)/
  });

  profile.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: ({
      resource
    }) => /node_modules/.test(resource),
  }));

  profile.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    compress: {
      warnings: false, // Suppress uglification warnings
      pure_getters: false,
      unsafe: false,
      unsafe_comps: false,
      screw_ie8: false
    },
    output: {
      comments: false,
    },
    exclude: [/\.min\.js$/gi] // skip pre-minified libs
  }));

}

module.exports = profile;