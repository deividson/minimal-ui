const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { ModuleFederationPlugin } = webpack.container

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

module.exports = {
  mode: env,
  entry: {
    style: path.resolve(__dirname, './src/style/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    port: 3002,
    client: {
      logging: 'none',
      overlay: false,
    },
    static: [
      { directory: path.join(__dirname, 'dist') },
    ],
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'minimal_ui',
      library: { type: 'var', name: 'minimal_ui' },
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components',
        './utils': './src/utils',
        './analytics': './src/analytics',
      },
      shared: {
        preact: { eager: true },
        idb: { eager: true },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: isProduction,
  },
  experiments: {
    topLevelAwait: true,
  },
  devtool: !isProduction ? 'inline-source-map' : undefined,
}
