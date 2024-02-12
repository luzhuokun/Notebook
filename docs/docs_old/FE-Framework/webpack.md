## tapable 原理分析

主要是控制钩子事件的订阅和发布，一个类似 Node 中的 EventEmitter，webpack 通过 tapable 将实现和流程解偶

- ### 实例化 Hook
  - 同步钩子：
    - SyncHook （执行每一个，不关心函数返回）
    - SyncBailHook （顺序执行，遇到第一个结果 result!==undefined 则返回，不再继续执行）
    - SyncWaterfallHook （顺序执行，如果前一个 Hook 函数的结果作为后一个 hook 函数的第一个参数来使用，有点像 Array.prototype.reduce 的用法）
    - SyncLoopHook （不停循环执行 hook，直到所有函数结果 result===undefined）
  - 异步钩子：
    - AsyncParallelHook
    - AsyncParallelBailHook
    - AsyncSeriesHook
    - AsyncSeriesBailHook
    - AsyncSeriesWaterfallHook
  - 其他
    - HookMap
    - MultiHook
  - 样例
    - 同步用法：
    ```js
    const { SyncHook, SyncBailHook, SyncWaterfallHook } = require("tapable");
    const hook = new SyncHook(["arg1", "arg2"]);
    hook.tap("a", (arg1, arg2) => {
      console.log("a", arg1, arg2);
    });
    hook.tap("b", (arg1, arg2) => {
      console.log("b", arg1, arg2);
    });
    hook.call(1, 2);
    ```
    - 异步用法：
    ```js
    const {
      AsyncParallelHook,
      AsyncSeriesHook,
      AsyncSeriesWaterfallHook,
    } = require("tapable");
    const hook = new AsyncSeriesWaterfallHook(["arg1", "arg2"]);
    hook.tapAsync("a", (arg1, arg2, cb) => {
      setTimeout(() => {
        console.log("a", arg1, arg2);
        cb();
      }, 2000);
    });
    hook.tapPromise("b", (arg1, arg2) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("b", arg1, arg2);
          resolve("qqq");
        }, 1000);
      });
    });
    hook.tapPromise("b", (arg1, arg2) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("b", arg1, arg2);
          resolve("ttt");
        }, 1000);
      });
    });
    /* 使用AsyncSeriesWaterfallHook时有个坑，tapAsync和tapPromise混用会有问题，最好还是tapAsync对应callAsync，tapPromise对应promise来使用 */
    hook.promise("arg1", "arg2").then((a, b) => {
      console.log(a, b);
    });
    ```
- ### 挂载 tap
  - Hook.\_runRegisterInterceptors 拦截器
  - Hook.\_insert
    - \_resetCompilation
      - 重置 call、callAsync、promise 三个函数
      - 在 \_resetCompilation 方法内部把 call 方法的值重置成了 \_call 方法，这是因为我们执行 call 方法时执行的是编译好的静态脚本，所以如果注册事件回调时不重置成 \_call 方法，那么因为惰性函数的缘故，执行的静态脚本就不会包含当前注册的事件回调了
    - 通过 options 中的 before 和 stage 来确定当前 tap 注册的回调位置，并排序 tap 放入到 taps 数组里面
- ### 触发 call
  - 在触发 call 的时候，是跑的 lazyCompileHook 函数，这个函数会调用\_createCall
  - \_createCall 调用对应 hook 中的 compile 进行编译
  - compile 中调用 HookCodeFactory.setup 把 options 上的 taps 放到 this.\_x 中
  - HookCodeFactory.create 运用 new Function 组装代码

!> webpack3.0 的 Tapable 用法有些不同，使用 plugin()把事件收集到 this.\_plugins 上面去，然后通过 applyPluginsXXXX(name,...)去触发

## loader 原理分析

loader 主要是用于对模块代码进行转换。

### 自定义 loader

```js
const loaderUtils = require("loader-utils");
module.exports = function (source) {
  const options = loaderUtils.getOptions(this) || {}; // 拿到webpack.config.js对应loader的option配置信息
  /* 经过一堆处理后，最终返回处理后的字符串出去 */
  return "处理后的字符串";
};
```

### 自定义 plugin

新建一个 Myplugin.js 文件

```js
class Myplugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    console.log("开始执行插件");

    compiler.plugin("compile", function () {
      console.log("webpack 编译器开始编译...-----");
    });

    compiler.plugin("compilation", function (compilation) {
      console.log("编译器开始一个新的编译任务...-----");
      compilation.plugin("optimize", function () {
        console.log("编译器开始优化文件...");
      });
    });
    compiler.plugin("done", function () {
      console.log("打包完成......");
    });
  }
}
module.exports = Myplugin;
```

在 webpack 中的配置：

```js
const Myplugin = require("./Myplugin.js");
// ....
plugins: [new Myplugin({ arg1: "test" })];
```

## output 中的 chunkFilename 属性

chunkFilename 一般用于显示生成的异步加载的文件名
按需加载（异步）模块的时候，这样的文件是没有被列在 entry 中的使用 CommonJS 的方式异步加载模块

## 利用 CommonsChunkPlugin 插件做分包优化

当如果 module 不存在普通 chunk 引入在，只在异步模块中出现的话，那么会出现一个重复加载公共代码的现象  
如果在异步模块中，import()或 require.ensure()按需加载会立即提取出一个异步 chunk 出来  
如果在异步模块中，import 或 require 模块时，webpack 不会进行  
webpack 组 chunk 的时候，不使用 CommonsChunkPlugin 的话，经静态分析，只会把 module 都组装到当前的 chunk 中去，不会分离出单独的 chunk，所以就会造成多个 chunk 之间的公共代码冗余

因此加入如下代码来抽取公共代码

```js
new webpack.optimize.CommonsChunkPlugin({
  name: "app",
  async: "vendor-async",
  children: true,
  minChunks: 3,
});
```

!> [参考文献](https://www.jianshu.com/p/8b840a23129b)

## Webpack HMR 原理解析

- webpack 对文件系统进行 watch 打包到内存中
- devServer 把文件改变的消息通知给浏览器端
- 浏览器端中的 webpack-dev-server/client 接收服务器端传来的 hash 消息进行缓存
- webpack/lib/HotModuleReplacement.runtime 中调用 check 检查是否更新，在 check 过程中调用 hotDownloadManifest 发起 ajax 请求，若有更新文件列表，则通过 hotDownloadUpdateChunk 进行 jsonp 请求，把模块代码请求下来交给 HMR runtime 进行下一步处理
- HotModuleReplacement.runtime 对模块进行热更新
- 调用提前嵌入到业务代码中的 HMR 中的 accept 方法，把新替换进来的模块执行一遍

?>watch 内存 -> hash 消息通信 -> HMR.runtime、HotDownloadManifest、HotDownloadUpdateChunk -> accept  
 参考文献：https://www.jianshu.com/p/95f5f51e6fc7

## webpack 打包后生成 app、vendor、manifest 区别

vendor.js 默认是把 node_modules 里 require 的依赖打包到这个 bundle 上去
mainfest.js 在 vendor 的基础上，将一些异步加载打包进去
app.js 主要放我们自己写的 js 代码等
分离出这些文件，主要是想利用浏览器缓存，node_modules 中的代码都不是常变化的话，因此用户在访问的时候，就不需要重新下载他们了。
