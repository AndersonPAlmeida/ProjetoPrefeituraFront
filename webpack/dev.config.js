const path = require('path');
const webpack = require('webpack');
const assetsPath = path.resolve(__dirname, '../public/assets');
const { webpackHost, webpackPort } = require('../config/env');
const webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);
const autoprefixer = require('autoprefixer');
module.exports = {
  devtool: 'inline-source-map',
  /* base dir to resolve entry points and loaders */
  context: path.resolve(__dirname, '..'),
  /* files that will be bundled and will have their require()s solved */
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${webpackHost}:${webpackPort}/__webpack_hmr`,
      './src/index.js',
    ],
  },
  /* bundled files */
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${webpackHost}:${webpackPort}/assets/`,
  },
  /* allows you to require other extensions in javascript */
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [ 'react-hot-loader','babel-loader' ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]!postcss-loader',
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10240',
      },
    ],
  },
  /* makes it able to require files in a more flexible way */
  resolve: {
    modules: [
      'node_modules',
      'src',
    ],
    extensions: ['.json', '.js', '.jsx'],
  },
  plugins: [
    /* hot reload (dev only) */
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    /* variables that set env to development (DEVTOOLS will enable redux devtools) */
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __DEVTOOLS__: false,
      'process.env': {
      NODE_ENV: '"development"',
      },
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer
        ]
      }
    }),
    webpackIsomorphicToolsPlugin.development(),
  ],
};
