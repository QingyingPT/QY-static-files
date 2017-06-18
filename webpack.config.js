const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = require('./config');

const jsfilename = '[name].js';
const cssfilename = '[name].css';
// const bundlename = `[path][name].[ext]`;

const extractCSS = new ExtractTextPlugin(cssfilename);
const uglifyPlugin = new UglifyJSPlugin({
  test: /\.js$/,
  comments: false,
});
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity,
});

module.exports = {
  entry: {
    vendor: ['ramda', 'superagent'],
    styles: './src/styles/index.js',
    userinfo: './src/userinfo/index.js',
  },
  output: {
    filename: jsfilename,
    // chunkFilename: jsfilename,
    path: config.outputdir,
    // pathinfo: true,
    publicPath: config.rootdir,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: true,
          },
        }],
      }),
    // }, {
    //   test: /\.json$/,
    //   use: 'json-loader',
    }],
  },
  plugins: [
    extractCSS,
    uglifyPlugin,
    commonChunkPlugin,
  ],
};

if (require.main === module) {
  console.info(module.exports);
}
