const path = require("path");
const webpack = require("webpack");
const dist = path.resolve(__dirname, "dist");
const nodePath = path.resolve(__dirname, "node_modules");


var profile = {};
profile.plugins = [];
profile.module = {};
profile.module.rules = [];

if (process.env.MODE === "dev") {
  profile.entry = {
    app: ["./alloydbweb/app.js", "webpack-hot-middleware/client"]
  };
  profile.devtool = "inline-source-map";
  console.log("packing dev mode source");
} else {
  profile.devtool = "cheap-module-source-map";
  profile.entry = {
    app: ["./app.js"]
  };
  console.log("packing release mode source");
}

// Required plugins 
profile.plugins.push(new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  "window.jQuery": "jquery",
  lodash: "lodash",
  _: "lodash",
  Popper: ["popper.js", "default"]
}));

profile.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

profile.plugins.push(new webpack.DefinePlugin({
  "DEV_MODE": process.env.MODE === "dev",
  "SERVER_HOST": process.env.SERVER_HOST,
  "SERVER_PORT": process.env.API_UI_PORT,
  "JADE_PORT": process.env.JADE_PORT
}));


// Rules and loaders
profile.module.rules.push({
  test: /\.(png|svg|jpg|gif)$/,
  use: ["file-loader"]
});

profile.module.rules.push({
  test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "url-loader",

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
      plugins: () => {
        return [
          require("precss"),
          require("autoprefixer")
        ];
      }
    }
  },
  {
    loader: path.resolve(__dirname, "..", "common", "fast-sass-loader"),
    options: {
      implementation: "dart-sass",
      includePaths: [path.join(nodePath, "compass-mixins", "lib")]
    }
  }
  ]
});

profile.module.rules.push({
  test: /\.less$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "less-loader",
      options: {
        includePaths: [nodePath]
      }
    }
  ],

});

// Output
profile.output = {
  filename: "[name].js",
  chunkFilename: "[name]-[chunkhash].js",
  path: path.resolve(__dirname, dist)
};


// Dev - Production specific

if (process.env.MODE === "dev") {

  if (process.env.USE_ANALYZER === "true") {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
    profile.plugins.push(new BundleAnalyzerPlugin());
  }

  const LiveReloadPlugin = require("webpack-livereload-plugin");
  profile.plugins.push(new LiveReloadPlugin({
    port: 1908
  }));
  profile.plugins.push(new webpack.HotModuleReplacementPlugin());

} else {
  const CleanWebpackPlugin = require("clean-webpack-plugin");
  profile.plugins.push(new CleanWebpackPlugin([dist]));

  profile.module.rules.push({
    test: /\.js$/,
    use: [{
      loader: "strip-loader?strip[]=debug"
    },
    {
      loader: "babel-loader",
      options: {
        plugins: [
          "@babel/plugin-transform-runtime",
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true,
            }
          ],
          "@babel/plugin-proposal-class-properties",
          ["angularjs-annotate", {
            explicitOnly: false
          }]
        ],
        presets: ["@babel/preset-env"]
      }
    }
    ],
    exclude: /(node_modules|bower_components|angular-auto-complete\.js)/
  });

  profile.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
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