const path = require("path");
const webpack = require("webpack");
const dist = path.resolve(__dirname, "dist");
const BrotliPlugin = require("brotli-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const nodePath = path.resolve(__dirname, "node_modules");

var profile = {};
profile.plugins = [];
profile.module = {};
profile.module.rules = [];
console.log("packing " + process.env.MODE + " source");

// Output
profile.output = {
  filename: "[name].js",
  path: path.resolve(__dirname, dist),
  //publicPath: "http://localhost:" + process.env.API_UI_PORT + "/"
};

profile.devServer = {
  publicPath: "/",
  contentBase: __dirname,
  hot: true,
  watchContentBase: true,
  compress: true,
  port: 9001
};

if (process.env.MODE === "dev") {
  profile.mode = "development";
  profile.entry = {
    app: ["./alloyweb/app.js", "webpack-hot-middleware/client"]
  };
  profile.devtool = "inline-source-map";
} else {
  profile.mode = "production";
  profile.devtool = "";
  profile.entry = {
    app: ["./alloyweb/app.js"]
  };

}

profile.entry.vendor = [path.join(__dirname, "API", "cast.framework.js"), path.join(__dirname, "API", "cast.v1.js")];

profile.optimization = {
  splitChunks: {
    chunks: "async",
    cacheGroups: {
      commons: {
        name: "app",
        chunks: "initial",
        minChunks: 2,
        maxInitialRequests: 5, // The default limit is too small to showcase the effect
        minSize: 0 // This is example is too small to create commons chunks
      },
      vendor: {
        test: /node_modules/,
        chunks: "initial",
        name: "vendor",
        priority: 10,
        enforce: true
      }
    }
  }
};

if (process.env.MODE === "dev") { profile.optimization.minimize = false; } else {
  profile.optimization.minimize = true;
  profile.optimization.minimizer = [
    // we specify a custom UglifyJsPlugin here to get source maps in production
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: true,
        ecma: 6
        
      },
      sourceMap: true
    })
  ];
}

// Required plugins 
profile.plugins.push(new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  lodash: "lodash/core",
  _: "lodash/core",
  "window.jQuery": "jquery",
  Popper: ["popper.js", "default"]
}));

profile.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

profile.plugins.push(new webpack.DefinePlugin({
  "DEV_MODE": process.env.MODE === "dev",
  "API_PORT": process.env.API_PORT,
  "API_UI_PORT": process.env.API_UI_PORT,
  "JADE_PORT": process.env.JADE_PORT
}));

if (process.env.MODE === "dev") {

  if (process.env.USE_ANALYZER === "true") {
    profile.plugins.push(new BundleAnalyzerPlugin());
  }

  profile.plugins.push(new LiveReloadPlugin({
    port: 1908
  }));

  profile.plugins.push(new webpack.HotModuleReplacementPlugin());

} else {
  const CleanWebpackPlugin = require("clean-webpack-plugin");
  profile.plugins.push(new CleanWebpackPlugin([dist]));

  profile.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

  profile.plugins.push(new CompressionPlugin({
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$|\.jade$/,
    compressionOptions: { level: 9 }
  }));

  profile.plugins.push(new BrotliPlugin({
    asset: "[path].br[query]",
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8
  }));
}

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
    loader: path.resolve(__dirname, "API", "fast-sass-loader"),
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

if (process.env.MODE === "prod") {
  profile.module.rules.push({
    test: /\.js$/,
    use: [
      {
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
    exclude: /(node_modules|bower_components)/
  });
}

module.exports = profile;