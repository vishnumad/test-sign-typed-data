const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    compress: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/index.html'
    }),
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
}
