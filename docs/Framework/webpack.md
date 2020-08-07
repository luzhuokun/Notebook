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
如果module不存在普通chunk引入在，只在异步模块中出现的话，那么会出现一个重复加载公共代码的现象。  
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
