const path = require('path')

module.export = {
  entry: {
    'minimal-ui': path.resolve(__dirname, './packages/style/src/index.js'),
  },
  output: {
    library: ['minimal-ui'],
    path: path.resolve(__dirname, './packages/style/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
}
