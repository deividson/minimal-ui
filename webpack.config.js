const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ModuleFederationPlugin } = webpack.container
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

module.exports = {
  mode: env,
  entry: {
    style: path.resolve(__dirname, `./src/style/index.js`)
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3002,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,  
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
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'minimal_ui',
      library: { type: "var", name: "minimal_ui" },
      filename: "remoteEntry.js",
      exposes: {
        './components': "./src/components",
        './utils': "./src/utils",
        './analytics': "./src/analytics",
      },
      shared: { 
        preact: { eager: true },
        idb: { eager: true },
      }
    }),    
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      disable: !isProduction,
    })
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    })],
  },
  experiments: {
    topLevelAwait: true,
  },
  devtool: !isProduction ? 'inline-source-map' : undefined,
}
