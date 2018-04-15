const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const JsDocPlugin = require('jsdoc-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const homePageTemplate = '../assets/template/index.html';
const exclude = /node_modules/;
const srcPath = path.resolve(__dirname, 'src');
const JSDocPath = path.resolve(__dirname, 'jsdoc.conf.json');
const PostcssLocalIdentName = '[name]---[local]---[hash:base64:5]';
const entryPath = './client/index.js';
let appCSS = null;

const initialiseStyles = (environment) => {
  const appCSSFileName = environment === 'development' ? 'app.css' : 'app.[chunkhash].css';

  appCSS = new ExtractTextPlugin({
    filename: appCSSFileName,
  });

};

const commonPlugins = (environment) => {
  const isDev = environment === 'development';
  // const isProd = environment === 'production';
  return [new CleanWebpackPlugin(['dist'], { verbose: true }),
    new HtmlWebpackPlugin({
      hash: isDev,
      template: homePageTemplate,
      filename: 'index.html',
      alwaysWriteToDisk: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment),
    }),
    appCSS,
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ];
};

const devPlugins = environment => commonPlugins(environment).concat([
  new webpack.HotModuleReplacementPlugin(),
  new JsDocPlugin({
    conf: JSDocPath,
  }),
  new BundleAnalyzer.BundleAnalyzerPlugin(),
  new HtmlWebpackHarddiskPlugin(),
]);

const prodPlugins = environment => commonPlugins(environment).concat([
  new webpack.optimize.AggressiveMergingPlugin(),
]);

const getPlugins = environment => (environment === 'development' ? devPlugins(environment) : prodPlugins(environment));

module.exports = (environment) => {
  const isDev = environment === 'development';
  const isProd = environment === 'production';
  initialiseStyles(environment);
  return {
    context: path.resolve(__dirname, 'src'),
    node: false,
    entry: {
      development: [entryPath, 'webpack-hot-middleware/client'],
      production: [entryPath],
    }[environment],
    output: {
      filename: isDev ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    devtool: isDev ? 'eval-source-map' : 'false',
    resolve: {
      alias: {
        Component: path.resolve(__dirname, 'src/client/components'),
        CSS: path.resolve(__dirname, 'assets/css'),
      },
      extensions: ['.js', '.jsx', '.less'],
    },
    plugins: getPlugins(environment),
    mode: environment,
    optimization: {
      minimize: isProd,
      splitChunks: {
        name: false,
        cacheGroups: {
          'async-vendors': {
            chunks: 'async',
            minChunks: 2,
            priority: 0,
            name: 'async-vendors',
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: -10,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /(\.js$|\.jsx$)/,
          exclude,
          use: {
            loader: 'babel-loader?cacheDirectory',
          },
        }, {
          test: /\.(jpe?g|svg|gif|png)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]?[hash]',
              },
            },
            {
              loader: 'img-loader',
              options: {
                enabled: process.env.NODE_ENV === 'production',
                gifsicle: {
                  interlaced: false,
                },
                mozjpeg: {
                  progressive: true,
                  arithmetic: false,
                },
                optipng: false, // disabled
                pngquant: {
                  floyd: 0.5,
                  speed: 2,
                },
                svgo: {
                  plugins: [
                    { removeTitle: true },
                    { convertPathData: false },
                  ],
                },
              },
            },
          ],
        }, {
          test: /\.css$/,
          use: appCSS.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: PostcssLocalIdentName,
                },
              }, {
                loader: 'postcss-loader',
              },
            ],
          }),
        }, {
          test: /\.less$/,
          use: appCSS.extract({
            use: [{
              loader: 'css-loader',
            }, {
              loader: 'less-loader',
              options: { javascriptEnabled: true },
            }],
            fallback: 'style-loader',
          }),
        }, {
          test: /\.html$/,
          loader: 'raw-loader',
        },
      ],
    },
  };
};
