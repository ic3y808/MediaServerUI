var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');


module.exports = {
  context: __dirname + '/app',
  entry: {
    app: './app.js',
    vendor: ['angular']
  },
  optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
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
	},
  output: {
    path: __dirname + '/JS',
    filename: '[name].js'
  },
  plugins: [
    //new HtmlWebPackPlugin({
    //  template: "./src/index.html",
    //  filename: "./index.html"
    //}),
    new LiveReloadPlugin()
  ]
};