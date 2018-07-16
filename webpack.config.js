var path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '.'),
    filename: 'build/index.js',
    library:'',
    libraryTarget:'commonjs'
  }
}
