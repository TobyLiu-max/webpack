const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLInlineCSSWebpackPlugin =
  require('html-inline-css-webpack-plugin').default

module.exports = {
  // 单入口
  //   entry: './src/index.js',
  //   output: {
  //     path: path.resolve(__dirname, 'dist'),
  //     filename: 'build.js'
  //   },
  //   多入口
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'development',
  optimization: {
    minimize: false
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: /src/,
        use: {
          loader: 'babel-loader',
          options: {
            //一个preset 可能包含多个 plugin
            presets: [
              [
                '@babel/preset-env'
                // {
                //   useBuiltIns: 'usage', // alternative mode: "entry"
                //   corejs: 3, // default would be 2
                //   targets: '> 0.25%, not dead'
                //   // set your own target environment here (see Browserslist)
                // }
              ],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'] // loader是链式调用，从右到左执行
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem=75px
              remPrecision: 8 //小数位数，这里是8位
            }
          },
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        // use: 'file-loader'
        use: [
          // 可以设置较小的资源自动base64
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8
            }
          }
        ]
      },
      {
        test: /\.(ttf)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new HTMLInlineCSSWebpackPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, //是否压缩
    port: 9000
  }
}
