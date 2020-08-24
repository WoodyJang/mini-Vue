const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './app.js',
  output: {
    path: path.resolve('.dist'),
    filename: 'vendor.js'
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      compiler: path.resolve('./src/compiler'),
      core: path.resolve('./src/core'),
      shared: path.resolve('./src/shared')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
