var devConfig = require('./webpack.config.js');
var webpackStripLoader = require('strip-loader');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var webpack = require('webpack');

var stripLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: webpackStripLoader.loader('console.log')
};

var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
              minimize: true,
              compress: {
                warnings: false
              }
            });

var optimizeCssAssets = new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    })

devConfig.module.rules.push(stripLoader);
devConfig.plugins.push(uglifyPlugin);
devConfig.plugins.push(optimizeCssAssets);

module.exports = devConfig;