## 第一章 webpack 与构建发展简史

### 为什么需要构建工具

转换 ES6、转换 JSX、CSS 前缀不全/预处理、压缩混淆、图片压缩

### 前端构建演变之路

![image-20210528193551181](/Users/zhifu/Library/Application Support/typora-user-images/image-20210528193551181.png)

### 为什么选择 webpack

1、社区活跃度高，github start，周下载量 在构建工具中领先，是目前最流行的构建工具

2、社区生态丰富、配置灵活和插件化扩展、官方更新迭代速度快

### 初识 webpack

1、webpack 默认配置文件：webpack.config.js

可以通过 webpack --config 指定配置文件

配置组成：

![image-20210528194336633](/Users/zhifu/Library/Application Support/typora-user-images/image-20210528194336633.png)

## 第二章 webpack 基础用法

### entry

用来指定 webpack 应该使用哪个模块，来作为构建其内部*依赖图*的开始

单入口：entry 是一个字符串

```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

多入口：entry 是一个对象

```
module.exports = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

### output

用来指定 webpack 编译后的文件输出的目录，以及如何命名这些文件

单入口：filename 写死

```
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};
```

多入口：通过占位符([])确保文件名称的唯一

```
const config = {
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};
```

### loader

> webpack 开箱即用只支持 Js 和 JSON 两种文件类型，通过 loader 去支持其它文件类型并且把它们转化成有效的模块，并且可以添加到依赖图中。
>
> Loader 本身是一个函数，接受源文件作为参数，返回转换的结果。

常见 loader：

![image-20210529104700966](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529104700966.png)

#### Loader 的用法：

```javascript
module.exports = {
  module: {
    rules: [
      //test 指定匹配规则,use 指定使用的loader名称
      { test: /\.ts$/, use: 'ts-loader' }, //单个loader，use 字符串
      {
        test: /\.css$/,
        use: [
          //使用多个loader use用数组，
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              // options: loader 参数
              modules: true
            }
          }
        ]
      }
    ]
  }
}
```

### plugins

> 插件用于 bundle 文件的优化，资源管理和环境变量注入

常见的 plugins:

![image-20210529105635877](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529105635877.png)

#### 用法

把要用的插件放在 plugins 数组里

```
const config = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### mode

> Mode 用来指定当前的构建环境是：production、development、node

设置 mode 可以使用 webpack 内置的函数，默认值为 production

![image-20210529110347268](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529110347268.png)

### 解析 ES6 和 JSX

#### 解析 ES6

使用 babel-loader

babel 的配置文件：.babelrc

webpack 配置：

```javascript
const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] //一个preset 可能包含多个 plugin
          }
        }
      }
    ]
  }
}
```

.babelrc 配置：

```

```

#### 解析 JSX

### 解析 CSS

style-loader: 向 DOM 插入 style 标签，并且将样式插入进去，这样网页才能解析到
css-loader: 可以让 webpack 解析 css(因为 webpack 原生只支持 js 和 json 的解析)，并且将解析出来的 css 转换成一个对象，插入到 JS 里面去。
less-loader: 将 less 转换成 css

### 解析图片和字体资源

解析图片：file-loader

也可以用 url-loader 处理，可以设置较小的资源自动 base64

### webpack 中的文件监听

> 文件监听是在发现源码发生变化时，自动重新构建出新的输出文件

webpack 开启监听模式，有两种方式：

- 启动 webpack 命令时，带上 `--watch`

- 在配置 webpack.config.js 中设置 watch:true

<img src="/Users/zhifu/Library/Application Support/typora-user-images/image-20210529153649982.png" alt="image-20210529153649982" style="zoom:50%;" />

### webpack 热更新

webpack-dev-server

WDS 不刷新浏览器

WDS 不输出文件，而是放在内存中，所以速度很快

和 HotModuleReplacementPlugin 插件配合使用

#### 热更新原理实现

![image-20210529155431139](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529155431139.png)

#### 使用 webpack-dev-server

```
1、yarn add webpack-dev-server -D
2、添加webpack 配置
module.exports= {
		mode:"develioment",
	  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, //是否压缩
    port: 9000
  }
}
3、添加script 命令
  "scripts": {
    "dev": "webpack serve --open"
  },
```

### 文件指纹策略：chunkhash、contenthash 和 hash

> 文件指纹：打包后输出的文件名的后缀

Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改

Chunkhash：和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash

Contenthash：根据文件内容来定义 hash, 文件内容不变，则 contenthash 不变

![image-20210529162405573](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529162405573.png)

```
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[hash:8].js' // 8: hash值取前8位
  },
```

#### 打包 css 文件：

使用插件：mini-css-extract-plugin

注意：把之前的 style-loader 换成 MiniCssExtractPlugin.loader

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [new MiniCssExtractPlugin({ filename: '[name]_[contenthash].css' })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
}
```

### HTML、CSS 和 JavaScript 代码压缩

#### JS 文件压缩

内置了 uglifyjs-webpack-plugin 插件压缩

在 mode=production 时 会自动压缩

#### CSS 文件压缩

使用 optimize-css-assets-webpack-plugin

webpack5 使用：css-minimizer-webpack-plugin

#### HTML 文件的压缩

html-webpack-plugin,设置压缩参数

一个页面对应一个 html-webpack-plugin

使用这个插件，在 html 中可以使用 ejs 的语法

## 第三章 webpack 进阶用法

### 自动清理构建目录产物

1、可以通过 npm scripts：` rm -rf ./dist && webpack`

2、使用 clean-webpack-plugin

### PostCSS 插件 autoprefixer 自动补齐 CSS3 前缀

使用 autoprefixer 插件

1、安装

```
yarn add postcss-loader autoprefixer -D
```

2、webpack 配置

```javascript
rules: [
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'less-loader',
      'postcss-loader'
    ]
  }
]
```

3、添加 postcss.config.js 文件

```
module.exports = {
  plugins: [require('autoprefixer')]
}
```

4、添加 .browserslistrc 文件

```javascript
# Browsers that we support
last 10 version  // 根据实际需求设置，这里只是为了显示效果
> 1%
defaults
not IE 11
 // maintained node versions  webpack5 使用这个报错，删除
```

### 移动端 css px 自动转换成 rem

1、CSS 媒体查询实现响应式布局

```
@media screen and(max-width:980px){
	.header{
		width:900px;
	}
}
@media screen and(max-width:480px){
	.header{
		width:400px;
	}
}
```

缺点：需要写多套适配样式代码

2、rem

> W3C 对 rem 定义：font-size of the root element

rem 和 px 对比：

- rem 是相对单位

- px 是绝对单位

使用 px2rem-loader

页面渲染时计算根元素的 font-size 值

可以使用手淘的 lib-flexible (不推荐使用了)

1、安装

yarn add px2rem-loader -D

2、webpack 配置

```javascript
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
```

**注意**：loader 是有执行顺序的，从右往左执行，如果先执行 px2rem-loader，在执行 less-loader，并且 less 里面有嵌套的语法，会报错

![image-20210529211725702](/Users/zhifu/Library/Application Support/typora-user-images/image-20210529211725702.png)

要先执行 less-loader,把 less 转换成 css 以后在执行 px2rem-loader

今天踩坑了，要注意执行顺序

### 静态资源内联

#### 资源内联的意义

代码层面：

- 页面框架的初始化脚本
- 上报相关打点
- css 内联避免页面闪动

请求层面：

- 小图片或者字体内联（url-loader）

作用：减少页面的请求数量，从而提升页面的加载时间

##### html 内联

```
<%=require('raw-loader!./meta.html')%>
```

#### JS 内联

```
<%=require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js')%>
```

注意：因为使用 html-webpack-plugin，在 html 中可以使用 ejs 的语法

! 号后面是文件路径

#### CSS 内联

方案一：借助 style-loader

方案二：html-inline-css-webpack-plugin

webpack.config.js

```
const HTMLInlineCSSWebpackPlugin =
  require('html-inline-css-webpack-plugin').default


 plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new HTMLInlineCSSWebpackPlugin()
  ],
```

### 多页面应用打包通用方案

每个页面对应一个 entry, 一个 html-webpack-plugin

缺点：每次新增或删除页面需要改 webpack 配置
