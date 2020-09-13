const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

const addOptions = {
  devtool: !isProduction ? 'inline-source-map' : undefined,
}

module.exports = {
  mode: env,
  context: path.resolve(__dirname, './'),
  entry: {
    'minimal-ui': path.resolve(__dirname, './src/index.js'),
  },
  output: {
    library: ['minimal-ui'],
    path: path.resolve(__dirname, './dist'),
    filename: 'minimal-ui.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // extrai pra arquivo
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      // disable: !isProduction,
    }),
    // new HtmlWebpackPlugin({
    //   // minify: isProduction,
    //   // injetar os bundles automaticamente
    //   inject: true,
    //   minify: false,
    //   template: 'index.html',
    // }),
  ],
  optimization: {
    minimize: true,
    // minimizer: [new TerserPlugin({
    //   terserOptions: {
    //     ie8: false,
    //     keep_classnames: undefined,
    //     keep_fnames: false,
    //     safari10: false,
    //   },
    // })],
    splitChunks: {
      chunks: 'all',
    },
  },
  ...addOptions,
}
