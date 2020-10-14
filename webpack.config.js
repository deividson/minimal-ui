const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { ModuleFederationPlugin } = webpack.container
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

const addOptions = {
  devtool: !isProduction ? 'inline-source-map' : undefined,
}

// TODO receber publicPath como argumento pra definir destino no deploy
const publicPath = !isProduction ? 'http://localhost:3002/' : 'https://s3.glbimg.com/v1/AUTH_ba8e460c944543468c3c80cb9675751f/lab/minimal/demo/'

module.exports = {
  mode: env,
  entry: {
    // index: path.resolve(__dirname, `./src/index.js`),
    style: path.resolve(__dirname, `./src/style/index.js`)
  },
  output: {
    publicPath,
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
          // options: {
          //   rootMode: 'upward',
          // },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // fallback to style-loader in development
          // !isProduction
          //   ? { loader: 'style-loader', options: { injectType: 'styleTag' } } // injeta
          //   : MiniCssExtractPlugin.loader, // extrai pra arquivo
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
      // library: { type: "global", name: 'lib_demo' },
      // library: { type: "system" },
      filename: "remoteEntry.js",
      exposes: {
        './components': "./src/components",
        './utils': "./src/utils",
        // './style': "./src/style",
      },
      shared: ["preact", "idb"]
    }),    
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      disable: !isProduction,
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
    minimize: isProduction,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    })],
    // splitChunks: {
    //   chunks: 'all',
    // },
  },
  ...addOptions,
}
