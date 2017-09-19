const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''
const OpenPackPlugin = require('openpack')

module.exports = (options = {}) => ({
  entry: {
    vue: ['vue', 'vue-router', 'vuex', 'axios'],
    app: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[name].js?[chunkhash]',
    publicPath: options.dev ? '' : publicPath
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          root: resolve(__dirname, 'src'),
          attrs: ['img:src', 'link:href']
        }
      }]
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },
    {
      test: /\.s[a|c]ss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    },
    {
      test: /favicon\.png$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }]
    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]',
          limit: 5000
        }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vue']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new OpenPackPlugin({
      lan: true
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true, // 为了使用本机ip访问页面，关闭host检查
    port: 8080,
    proxy: {
      '/api/': {
        target: 'http://0.0.0.0:8080/api/', // 代理的地址，注意这里最好就以api开头，如果改了下面的重写也要跟着改
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
