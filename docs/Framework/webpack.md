['一文掌握Webpack编译流程'](https://blog.csdn.net/React_Community/article/details/107194743)

## 编译过程
- 初始化配置参数 合并配置文件和shell语句中的参数
- 开始编译 compiler.run 生成 compilation
- 编译模块 make阶段 1. 调用各种loaders进行编译，转换成js代码 2. acorn对js代码进行语法分析并收集依赖
- 输出资源 组装成一个个的chunk文件，调用seal进行封装，这步是可以修改输出内容的最后机会
- 完成输出 emit阶段，根据配置上的输出路径和文件名，把文件内容写入到文件系统中

## tapable原理分析
主要是控制钩子事件的订阅和发布，一个类似Node中的EventEmitter，webpack通过tapable将实现和流程解偶

- ### 实例化Hook
  * 同步钩子：
    - SyncHook （执行每一个，不关心函数返回）
    - SyncBailHook （顺序执行，遇到第一个结果result!==undefined则返回，不再继续执行）
    - SyncWaterfallHook （顺序执行，如果前一个Hook函数的结果作为后一个hook函数的第一个参数来使用，有点像Array.prototype.reduce的用法）
    - SyncLoopHook （不停循环执行hook，直到所有函数结果result===undefined）
  * 异步钩子：
    - AsyncParallelHook
    - AsyncParallelBailHook
    - AsyncSeriesHook
    - AsyncSeriesBailHook
    - AsyncSeriesWaterfallHook
  * 其他
    - HookMap
    - MultiHook
  * 样例
    - 同步用法：
    ```js
      const { SyncHook, SyncBailHook, SyncWaterfallHook } = require('tapable')
      const hook = new SyncHook(['arg1', 'arg2'])
      hook.tap('a', (arg1, arg2) => {
          console.log('a', arg1, arg2)
      })
      hook.tap('b', (arg1, arg2) => {
          console.log('b', arg1, arg2)
      })
      hook.call(1, 2)
    ```
    - 异步用法：
    ```js
      const { AsyncParallelHook, AsyncSeriesHook, AsyncSeriesWaterfallHook } = require('tapable')
      const hook = new AsyncSeriesWaterfallHook(['arg1', 'arg2'])
      hook.tapAsync('a', (arg1, arg2, cb) => {
          setTimeout(() => {
              console.log('a', arg1, arg2)
              cb()
          }, 2000);
      })
      hook.tapPromise('b', (arg1, arg2) => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  console.log('b', arg1, arg2)
                  resolve('qqq')
              }, 1000);
          })
      })
      hook.tapPromise('b', (arg1, arg2) => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  console.log('b', arg1, arg2)
                  resolve('ttt')
              }, 1000);
          })
      })
      /* 使用AsyncSeriesWaterfallHook时有个坑，tapAsync和tapPromise混用会有问题，最好还是tapAsync对应callAsync，tapPromise对应promise来使用 */
      hook.promise('arg1', 'arg2').then((a, b) => {
          console.log(a, b);
      });
    ```
- ### 挂载tap
  * Hook._runRegisterInterceptors 拦截器
  * Hook._insert 
    - _resetCompilation
      * 重置call、callAsync、promise三个函数
      * 在 _resetCompilation 方法内部把 call 方法的值重置成了 _call 方法，这是因为我们执行 call 方法时执行的是编译好的静态脚本，所以如果注册事件回调时不重置成 _call 方法，那么因为惰性函数的缘故，执行的静态脚本就不会包含当前注册的事件回调了
    - 通过options中的before和stage来确定当前tap注册的回调位置，并排序tap放入到taps数组里面
- ### 触发call
  * 在触发call的时候，是跑的lazyCompileHook函数，这个函数会调用_createCall
  * _createCall调用对应hook中的compile进行编译
  * compile中调用HookCodeFactory.setup把options上的taps放到this._x中
  * HookCodeFactory.create运用new Function组装代码

!> webpack3.0的Tapable用法有些不同，使用plugin()把事件收集到this._plugins上面去，然后通过applyPluginsXXXX(name,...)去触发

## loader原理分析
loader主要是用于对模块代码进行转换。
### 自定义loader
```js
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const options = loaderUtils.getOptions(this) || {}; // 拿到webpack.config.js对应loader的option配置信息
  /* 经过一堆处理后，最终返回处理后的字符串出去 */
  return '处理后的字符串';
}
```

## plugin原理分析
插件的功能目的在于解决loader无法实现的事情，从打包优化和压缩，再到重新定义环境变量等，可以用来处理各种各样的任务。

### 自定义plugin
新建一个Myplugin.js文件
```js
class Myplugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    console.log('开始执行插件')

    compiler.plugin('compile', function () {
        console.log('webpack 编译器开始编译...-----')
    })

    compiler.plugin('compilation', function (compilation) {
        console.log('编译器开始一个新的编译任务...-----')
        compilation.plugin('optimize', function () {
             console.log('编译器开始优化文件...')
        })
    })
    compiler.plugin('done', function () {
        console.log('打包完成......')
    })
  }
}
module.exports = Myplugin
```

在webpack中的配置：
```js
const Myplugin = require('./Myplugin.js');
// ....
plugins:[
  new Myplugin({arg1:'test'})
]
```

## compiler和compilation的区别
编译器和编译集合的区别，compiler代表了整个webpack从启动到关闭的生命周期，而compilation代表了一次新的编译。

## 打包流程
初始化`参数`合并配置->加载所有`插件`->确定`入口`->开始`编译`(调用各种loader模块转换器)模块找出所有`依赖`模块->生成`资源`chunk->生成`文件`bundle到指定文件位置

- optimist 命令行和参数解析
- config 合并与插件加载
- compile 开始编译 
  * compiler.run 后首先会触发 compile 这一步会构建出 Compilation 对象
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
  * 调用各 loader 处理模块之间的依赖
  * 调用 acorn 解析经 loader 处理后的源文件生成抽象语法树 AST
  * 遍历 AST 构建该模块所依赖的模块
- build-module 构建模块
- after-compile 完成构建
- seal 封装构建结果
- emit 把各个chunk输出到结果文件
- after-emit 完成输出
- done 完成

![github pages](https://img.alicdn.com/tps/TB1GVGFNXXXXXaTapXXXXXXXXXX-4436-4244.jpg)

?> [细说webpack之流程篇](https://blog.csdn.net/yingxiaoqiang520/article/details/56677654)

## output中的chunkFilename属性
chunkFilename一般用于显示生成的异步加载的文件名
按需加载（异步）模块的时候，这样的文件是没有被列在entry中的使用CommonJS的方式异步加载模块

### require.ensure按需加载
webpack使用require.ensure将vue页面打包成独立的chunk文件，也可以将多个vue页面合并成一个chunk文件，以实现生产环境按需加载,require.ensure是webpack所独有的，可以被es6的import取代

## 对module、chunk、bundle的理解
1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 module 
2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 chunk 文件，webpack 会对这个 chunk 文件进行一些操作
3. webpack 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行

一般来说一个 chunk 对应一个 bundle，比如上图中的 utils.js -> chunks 1 -> utils.bundle.js；但也有例外，比如说上图中，我就用 MiniCssExtractPlugin 从 chunks 0 中抽离出了 index.bundle.css 文件。

## 利用CommonsChunkPlugin插件做分包优化
当如果module不存在普通chunk引入在，只在异步模块中出现的话，那么会出现一个重复加载公共代码的现象  
如果在异步模块中，import()或require.ensure()按需加载会立即提取出一个异步chunk出来  
如果在异步模块中，import或require模块时，webpack不会进行  
webpack组chunk的时候，不使用CommonsChunkPlugin的话，经静态分析，只会把module都组装到当前的chunk中去，不会分离出单独的chunk，所以就会造成多个chunk之间的公共代码冗余  

因此加入如下代码来抽取公共代码  
```js
new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    })
```

!> [参考文献](https://www.jianshu.com/p/8b840a23129b)

## Scope Hoisting
Scope Hoisting可以让Webpack打包出来的代码文件更小、运行的更快， 它又译作"作用域提升"
webpack3使用ModuleConcatenationPlugin插件
https://www.jianshu.com/p/aad010894cf2

## cheap-module-eval-source-map
使每个模块代码都用eval()执行，并且把source map转换为DataUrl添加到eval中去，当代码执行的时候会生成实际的文件，当开发工具需要断点调试的时候，能直接把断点断在原始的文件中去
https://www.webpackjs.com/configuration/devtool/#对于开发环境

## Webpack HMR 原理解析

- webpack对文件系统进行watch打包到内存中
- devServer把文件改变的消息通知给浏览器端
- 浏览器端中的webpack-dev-server/client接收服务器端传来的hash消息进行缓存
- webpack/lib/HotModuleReplacement.runtime中调用check检查是否更新，在check过程中调用hotDownloadManifest发起ajax请求，若有更新文件列表，则通过hotDownloadUpdateChunk进行jsonp请求，把模块代码请求下来交给HMR runtime进行下一步处理
- HotModuleReplacement.runtime对模块进行热更新
- 调用提前嵌入到业务代码中的HMR中的accept方法，把新替换进来的模块执行一遍

?>watch内存 -> hash消息通信 -> HMR.runtime、HotDownloadManifest、HotDownloadUpdateChunk -> accept  
  参考文献：https://www.jianshu.com/p/95f5f51e6fc7

## webpack打包后生成app、vendor、manifest区别
vendor.js 默认是把node_modules里require的依赖打包到这个bundle上去
mainfest.js 在vendor的基础上，将一些异步加载打包进去
app.js 主要放我们自己写的js代码等
分离出这些文件，主要是想利用浏览器缓存，node_modules中的代码都不是常变化的话，因此用户在访问的时候，就不需要重新下载他们了。

## treeshaking及其工作原理
 - 定义：在bundle打包的时候清除掉包中不需要执行的代码
 - 前提：es6的import和export语法去做静态分析
 - 工作原理：webpack中，先利用babel把代码转生成AST抽象语法树，webpack再去分析ast树，把树中没有依赖关系的部分代码去掉
 - commonjs是动态引入的不适合treeshaking机制
 - 弊端：webpack自身的treeshaking不能分析副作用的模块代码，因为webpack是先加载资源的，再根据静态分析的结果来删除无用代码，如果未使用的副作用代码里使用了导入的模块，那webpack打包不会清掉这段无用的代码（1、写纯的无副作用代码 2、webpack-deep-scope-plugin去解决，原理是通过作用域分析来消除无用的代码）

## 优化
- 使用`webpack-bundle-analyzer`分析
- 模块异步加载
- 第三方库按需引入(需提供ESM版本)，这样webpack可以做静态分析tree-sharking，把没用到的代码不打包
- 抽取模块中公共代码，折腾CommonsChunkPlugin配置
- 使用compression-webpack-plugin做gzip代码压缩,需要浏览器的支持
- css代码如果不大可以不分离，不然会浪费时间在请求上面

[首屏性能优化](https://segmentfault.com/a/1190000019499007)

## 分包策略
[vue-element-admin分包策略](https://juejin.cn/post/6844903652956585992)

## 问题
- treesharking在webpack中的整个流程什么时间执行
先根据模块间依赖进行shaking，然后合并到对应的chunk中，然后有个问题就是某chunk中有些方法用不上的也会被合并进来（看下是否要把公共代码提取出来）
2、如何分包
