const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
});
const ExtractTextPluginConfig = new ExtractTextPlugin({
  filename: 'style.css',
});
const LoaderOptionsPluginConfig = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
});
const UglifyJSPluginConfig = new webpack.optimize.UglifyJsPlugin({
  beautify: false,
  mangle: {
    screw_ie8: true,
    keep_fnames: true,
  },
  compress: {
    screw_ie8: true,
  },
  comments: false,
});

const EnvironmentConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
});

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
    alias: {
      styles: 'src/sass/style.sass',
    },
  },
  module: {
    rules: [{
      test: /\.js?/,
      loaders: [
        'babel-loader',
      ],
      exclude: /node_modules/,
    }, {
      test: /\.sass$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: { plugins: () => [autoprefixer] },
        }, {
          loader: 'sass-loader',
        }],
      }),
    }],
  },
  plugins: [
    EnvironmentConfig,
    LoaderOptionsPluginConfig,
    HtmlWebpackPluginConfig,
    ExtractTextPluginConfig,
    UglifyJSPluginConfig,
  ],
};

module.exports = config;
