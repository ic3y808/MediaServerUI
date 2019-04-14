"use strict";
const path = require("path");
const webpack = require("webpack");
const dist = path.resolve(__dirname, "dist");
const nodePath = path.resolve(__dirname, "node_modules");
var config = require("../common/config");
var logger = require("../common/logger");

var profile = {};
profile.plugins = [];
profile.module = {};
profile.module.rules = [];

if (process.env.MODE === "dev") {
  profile.entry = {
    app: ["./web/frontend/app.js", "webpack-hot-middleware/client"]
  };
  profile.devtool = "inline-source-map";
  logger.info("receiver", "packing dev mode source");
} else {
  profile.devtool = "cheap-module-source-map";
  profile.entry = {
    app: ["./web/frontend/app.js"]
  };
  logger.info("receiver", "packing release mode source");
}

// Required plugins 
profile.plugins.push(new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  "window.jQuery": "jquery",
  Popper: ["popper.js", "default"],
  //Clipboard: "clipboard.js",
  //Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
  Button: "exports-loader?Button!bootstrap/js/dist/button",
  //Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
  Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
  //Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
  //Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
  Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
  //Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
  //Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
  Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
  Util: "exports-loader?Util!bootstrap/js/dist/util"
}));

profile.plugins.push(new webpack.DefinePlugin({
  "DEV_MODE": process.env.MODE === "dev",
  "SERVER_PORT": process.env.PORT
}));

// Rules and loaders

profile.module.rules.push({
  test: /\.(png|svg|jpg|gif)$/,
  use: ["file-loader"]
});

profile.module.rules.push({
  test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "url-loader"
});

profile.module.rules.push({
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: [
    "file-loader?name=images/[name].[ext]",
    "image-webpack-loader?bypassOnDebug"
  ]
});

profile.module.rules.push({
  test: /\.css$/,
  use: ["style-loader", "css-loader"]
});

profile.module.rules.push({
  test: /\.(scss|sass)$/,
  use: [{
    loader: "style-loader"
  },
  {
    loader: "css-loader"
  },
  {
    loader: "postcss-loader",
    options: {
      plugins: function () { // post css plugins, can be exported to postcss.config.js
        return [
          require("precss"),
          require("autoprefixer")
        ];
      }
    }
  },
  {
    loader: "sass-loader"
  }
  ]
});

// Output
profile.output = {
  filename: "[name].js",
  chunkFilename: "[name]-[chunkhash].js",
  path: path.resolve(__dirname, dist)
};

// Dev - Production specific

if (process.env.MODE === "dev") {
  const CleanWebpackPlugin = require("clean-webpack-plugin");
  profile.plugins.push(new CleanWebpackPlugin([dist]));

  const LiveReloadPlugin = require("webpack-livereload-plugin");
  profile.plugins.push(new LiveReloadPlugin({
    port: 1908
  }));
  profile.plugins.push(new webpack.HotModuleReplacementPlugin());

}

module.exports = profile;