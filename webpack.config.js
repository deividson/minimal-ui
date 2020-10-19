const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ModuleFederationPlugin } = webpack.container
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

const addOptions = {
  devtool: !isProduction ? 'inline-source-map' : undefined,
}
module.exports = {
  mode: env,
  entry: {
    style: path.resolve(__dirname, `./src/style/index.js`)
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
    }),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'minimal_ui',
      library: { type: "var", name: "minimal_ui" },
      filename: "remoteEntry.js",
      exposes: {
        './components': "./src/components",
        './utils': "./src/utils",
      },
      shared: { 
        preact: {
          eager: true,
        },
        idb: {
          eager: true,
        },
      }
    }),    
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
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
  ...addOptions,
}
