const path = require('path');
const webpack = require('webpack');
const dist = path.resolve(__dirname, 'dist');
const nodePath = path.resolve(__dirname, 'node_modules');

var profile = {};
profile.plugins = [];
profile.module = {};
profile.module.rules = [];

if (process.env.DEV === 'true') {
  profile.entry = {
    app: ['./frontend/app.js', 'webpack-hot-middleware/client']
  };
  profile.devtool = 'inline-source-map';
  console.log('packing dev mode source');
} else {
  profile.devtool = 'cheap-module-source-map';
  profile.entry = {
    app: ['./frontend/app.js']
  };
  console.log('packing release mode source');
}

// Required plugins 
profile.plugins.push(new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
}));

profile.plugins.push(new webpack.DefinePlugin({
  "DEV_MODE": process.env.DEV,
  "SERVER_PORT": process.env.PORT
}));

// Rules and loaders

profile.module.rules.push({
  test: /\.(png|svg|jpg|gif)$/,
  use: ['file-loader']
});

profile.module.rules.push({
  test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "url-loader"
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
      loader: 'sass-loader'
    }
  ]
});

// Output
profile.output = {
  filename: '[name].js',
  chunkFilename: '[name]-[chunkhash].js',
  path: path.resolve(__dirname, dist)
};

// Dev - Production specific

if (process.env.DEV === 'true') {
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  profile.plugins.push(new CleanWebpackPlugin([dist]));

  const LiveReloadPlugin = require('webpack-livereload-plugin');
  profile.plugins.push(new LiveReloadPlugin({
    port: 1908
  }));
  profile.plugins.push(new webpack.HotModuleReplacementPlugin());
  
}  

module.exports = profile;