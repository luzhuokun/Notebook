## webpack 的工作流程

- 初始化参数，合并配置，加载插件
- 创建 compiler 对象，管理整个编译流程
- 启动编译调用 run 方法，创建 compilation 对象，进入编译流程
- 从 entry 入口文件出发，收集各种模块依赖，生成依赖图
- 然后通过 loader 加载器对模块进行处理，合并生成 chunk
- 然后对 chunk 做进一步加工处理，生成 bundle 文件
- 最终把 bundle 输出到指定的文件目录上，完成编译

## compiler 和 compilation 区别

- compiler
  - webpack 初始化时生成的`全局唯一`对象，包含各种`配置信息`
  - 主要负责`启动编译`，控制编译流程，文件监听等功能
- compilation
  - 每一次编译重新生成
  - 对象上包含了本次`编译`时所需的相关信息，如模块信息、依赖信息等

## module、chunk 和 bundle 区别

- `module` 简单理解为我们写的 esmodule 代码、commonjs 代码等等
- `chunk` 是 webpack 的 loader 对 module 进行处理后生成的`中间产物`
- `bundle` 是`最终的文件形式`，是 webpack 对 chunk 进一步编译处理后生成的结果，可以直接在浏览器运行

## webpack loader 和 plugin 的作用

- webpack 的 loader 是一个`预处理器`，主要是对`非 js 类型`的模块文件进行处理，默认情况下 webpack 只处理 js 文件模块，当遇到比如 css 模块需要处理，webpack 会将 css 交给对应的 css loader 进行处理，处理完后再由 webpack 进行下一步的整合输出文件等工作
- webpack 的 plugin 作用是对 webpack 打包编译流程上各个环节的`增强和扩展`，通过 webpack 提供的 hooks `钩子`强化每个环节的功能

## 如何写 loader 和 plugin

- loader 是一个`函数`，接收上一个 loader 传过来的源文件内容，返回处理后的内容，内容支持字符串和二进制格式
- 使用时，通过 webpack 的 rules 属性配置，rules 是个数组，其中每个元素是一个对象，每个对象上有个 test 属性和 use 属性，test 用来匹配正则，命中要处理的文件，use 是一个数组，用来接收 loader，loader 的执行顺序是从右到左，从下到上

```js
  rules = {
    {
      enfore: normal, // pre > normal > inline > post
      test: /\.js$/,
      use: [
        {
          loader: path.resolve(__dirname, 'loaders/my-loader'),
          options: {
            esModule: true, // 在 my-loader 函数中通过调用 this.getOptions() 获取
          }
        }
      ]
    }
  };
  // loaders/my-loader.js
  module.exports = function (content, map, meta) {
      // 同步1
      return content;
      // 同步2
      // this.callback(null, result, map, meta);
      // return;
      // 异步1
      // const callback = this.async();
      // callback(null, result, map, meta);
      // return;
      return;
  };
```

- plugin 是一个`类`，使用时通过 new 实例化，给类传递一个 apply 方法，在 apply 中接收 compiler 作为入参，通过 compiler.hooks 给不同时刻的钩子注册事件，等待合适的时机运行
- 使用时把 plugin 实例化到一个 plugins 数组中

```js
plugins = [new MyPlugin({ username: "test" })];
// MyPlugin自定义插件定义
class MyPlugin {
  apply(compiler) {
    const { username } = this.options();
    compiler.hooks.done.tapAsync(
      "UploadfileWebpackPlugin",
      (compilation, cb) => {
        compilation.assets["copyright.txt"] = {
          source: function () {
            return "copyright by dell lee";
          },
          size: function () {
            return 21;
          },
        };
        cb(); //异步时需要手动执行第二个参数（回调函数  ）
      }
    );
  }
}
```

## webpack 有多少种文件 hash 类型

- `hash` 每一次构建都重新生成的 hash 值，只要有文件变化，这个 hash 值就会变
- `chunkhash` 同一个 chunk 相关的文件发生变化， chunkhash 值才会变
- `contenthash` 每个文件单独拥有的 hash 值，文件变化只会影响当前自己这个文件
- 作用：主要用途就是用来做浏览器缓存

## webpack hooks

- compiler hooks
  - run 在启动 webpack 运行时执行
  - compile 在开始编译模块之前执行
  - compilation 在创建 compilation 实例时执行
  - make 在创建编译完成后执行
  - emit 在资源输出到目录之前执行
  - done 在编译完成后执行
- compilation hooks
  - seal 封装完成之后执行
  - optimize 优化运行前执行

[compiler 钩子](https://webpack.docschina.org/api/compiler-hooks/)
[compilation 钩子](https://webpack.docschina.org/api/compilation-hooks/)

## HMR 热模块更新原理

- 首先，往`入口`文件`注入`通信和模块检查的相关`代码`
- 第二步，通过 webpack-dev-server `启动` http 和 socket `服务`
- 当监听到本地代码发生变化时（通过 compiler.watch 方法监听），触发`重新编译`，编译结果`缓存`到`内存`中，并`发射` hash 和 ok `事件`给浏览器
- 浏览器接收到通知后，根据上一次的 hash 值，先是请求`hot-update.json`，然后对文件中的 hash 值进行存储，用于下一次使用，根据 chunkId 和上次的 hash ,通过 jsonp 的方式请求 `hot-update.js` 文件进行加载
  - `[lastHash].hot-update.json` 告诉浏览器 下次的 hash 以及发生变化的 chunk
  - `[chunkId].[lastHash].hot-update.js` 告诉浏览器哪部分 chunk 的变化后的模块代码
- 最后解析`hot-update.js` 中的代码，`替换`现有`模块`，完成更新

[webpack 模块热更新原理](https://juejin.cn/post/7049608872553611301)

## sourcemap 的理解

- （是什么）sourcemap 是一个存储了打包前后代码位置信息的 `json 数据`
- （怎么配）在 webpack 通过 `devtool` 属性，配置不同的 sourcemap 存储方式
- 配置好 sourcemap 后，在被转换后的代码末尾会自动增加一行 sourceMappingURL 注释，浏览器会识别这行注释并解析
- （存储方式） sourcemap 主要有`内置`和`外置`两种存储方式
  - 内置：`eval`、`inline`
    - eval 把 sourcemap 通过 `eval 函数`执行的方式赋值到 sourceMappingURL 上 （还有个 sourceUrl 为了让浏览器生成文件）
    - inline 通过 dataUrl `base64` 的方式赋值到 sourceMappingURL 上
  - 外置：`source-map` 不带 eval、inline，生成单独的文件，并把文件地址赋值给 sourceMappingURL 上
- （存储结构）生成的 sourcemap json 中，最核心的是`mappings`字段存储的字符串，它由多个 `base64 VLQ 编码的字符串`、`逗号`和`分号`组成
  - 以`逗号`作为分隔符，间隔的数据对应转换前后的`位置`信息
  - 以`分号`表示换行
  - 一个位置由 5 位组成
    - 5 个位分别表示：转换后的列号、源文件集合的索引值、转换前行号、转换前列号、变量名集合的索引值
    - 每一位都由 base64 VLQ 编码生成，VLQ 编码可以表示任意长度的二进制数
      - VLQ 编码过程
        - 先把`十进制`转`二进制`，然后根据符号在最后补 0 或者 1
        - 接着对二进制数每 5 位进行`分组`，不足 5 位的补 0，分组完成后将所有分组`倒序`，倒序后对最后一组的头部补 0 表示不连续，其余分组头部补 1 表示连续
        - 最后对每一个分组进行 `base64` 转换，这样子就完成了 VLQ 编码
  - base64 VLQ 生成规则通过两个手段进行`优化`
    - 使用`相对位置`，记录的行号是相对上一个行位置的数值，这样可以进一步减少数的大小，进而减少存储空间
    - 使用`base64 vlq编码`，把一个十进制字符串转换成占用空间更小的 base64 字符串
  - 使用 base64 VLQ 编码不仅解码方便，还很节省空间
- （使用场景）在`开发环境`下，通常会配置成 eval-cheap-module-source-map，来加快编译速度
- （使用场景）`生产环境`，要么设置成 false，要么通过 sourceMapDevtoolPlugin 插件把 sourcemap 文件分发到监控系统，避免安全问题的同时也能很好地定位问题

[source-map 的原理](https://cloud.tencent.com/developer/article/1598223)

## webpack 性能优化

- 优化前，先通过工具检测性能瓶颈
  - webpack-bundle-analyzer
    - 扫描 bundle 并构建其内部内容的可视化
  - speed-measure-webpack-plugin
    - 获取每个插件和 loader 消耗时间
  - webpack-visualizer-plugin2
  - 在线工具
    - [官方可视化分析工具](https://webpack.github.io/analyse/)
- 主要做过 webpack 三个方向的优化
- `版本升级`，升级 webpack 和 nodejs `版本`，以及用到的相关的库包
  - 如：html-webpack-plugin 升级到 4.0 以上，能有效解决多页面开发环境下，卡顿问题
- `加速构建`
  - 采用`多进程`编译代码，thread-loader（官方）代替 happyPack（不再维护）
  - 采用`持久化缓存`，提升二次打包的构建速度，实现`增量编译`，通过在配置上设置 cache 属性 type 为 fileSystem 开启持久化缓存
    - babel-loader 、terser-webpack-plugin 也能开启缓存的功能，代替 cache-loader 插件
    - cache-loader 只能缓存经过 loader 处理后的结果，缓存内容的范围比较受限
    - 持久化缓存缓存的颗粒度更小，对模块也会缓存进行缓存
  - 使用官方提供的`资源模块`管理方式，代替 url-loader 和 file-loader 插件
  - 在开发阶段`关闭 ts 检查`，提升编译速度，ts 的检查会消耗大量的内存和 cpu 资源，在低内存的开发环境下卡顿明显，把 ts 检查放到提交代码的时候再检查
  - 设置`合理 sourcemap 规则`（开发：eval-cheap-module-source-map 生产：source-map）（生产环境下，设置 带有 cheap、module 属性不生效，效果跟直接设置成 false 一样）
    - 把 sourcemap 设置成以 eval 运行的函数内嵌在代码上，省去生成文件的时间，提高编译速度，在生产阶段再生成 sourcemap 文件并发送到指定的域名地址下
- `减少包体积`
  - `tree shaking` 剪枝去掉不使用的代码（webpack5 默认有）
  - `分包` split-chunks-plugin 插件（内置）
  - `压缩` 包括 js、css、图片等（terser-webpack-plugin 官方提供）（css-minimizer-webpack-plugin）
  - `抽取 css`（开发环境 style-loader，线上环境 mini-css-extract-plugin）
    - less-loader 把.less 文件转换成 css 文件
    - sass-loader 把.sass 文件转换成 css 文件
    - css-loader 把 css 文件转换成 webpack 能处理的文件
    - style-loader 把 css 内存挂载到 html 上面去

[五种可视化方案分析 webpack 打包性能瓶颈](https://juejin.cn/post/6844904056985485320)

## webpack5 比 webpack4 多优化了什么地方

- 默认启动 `tree shaking`，移除未使用的代码
- 增加`持久化缓存`机制，通过设置 cache 属性，代替 cache-loader 以及 ddl 方案
- 内置`资源模块`（asset module），用于静态资源构建，代替 url-loadr、file-loader、raw-loader
- 提供`模块联邦`特性（module federation），实现跨应用复用模块包，一种微前端的解决方案
- webpack4 已有
  - 内置`分包`插件 split-chunks-plugin，代替 commons-chunk-plugin
  - 提供`压缩`插件 terser-webpack-plugin，代替 uglifyjs-webpack-plugin

## webpack 如何实现资源按需（异步）加载

- `require.ensure`(webpack 提供的 api，调用时第一个参数传依赖数组，第二个参数传方法，方法内 require 的模块包会被打包到另外的 chunk 中)
- `import()`，一个 ES6 提供的动态加载模块语法，当 webpack 解析到模块中使用了动态加载模块的语法，就会把他们单独放到一个 chunk 中

## import 可以传入变量作为参数吗

- 不可以，因为 webpack 和 vite 不支持 import 的完全动态，传入变量的情况下，他们无法静态分析和处理模块依赖
- 但支持字符串模板的方式传入
- 原生的异步调用 import 是支持变量传入的

## SplitChunksPlugin 分包策略

- 首先，webpack 有三个分包策略
  - 自动根据`entry 入口`分包
  - 自动根据`动态导入`模块的方式分包
  - 手动配置 runtime 属性，对 webpack 的运行时代码进行分包
    通过在 optimization 上配置 runtimeChunk 为 true
- 在真实的业务场景，通过上面的分包策略还是不够的，会出现包被多次导入的情况，因此我们需要更细颗粒度的分包
- 需要通过 splitchunks 插件来做更细颗粒度地分包，通过配置 cacheGroups 进行分组，我会把代码包拆分成：框架包、公共代码包以及业务包，然后根据 chunk 块大小、引用次数、最大并行请求数等策略来进行分包。如果真实环境中都支持 http2.0，那可以选择把包拆分得更细一些，充分利用浏览器缓存，对于代码升级也会带来一定的好处
  - `分组`（cacheGroups）
    - 通过配置 cacheGroups 属性来进行分组
    - 会分别命名成不同的 name，框架包会命名为 vendors，公共组件包会命名为 commons
    - 然后通过 test 属性去匹配相关的模块名
    - 然后根据分组优先级，把相关的代码模块合并到对应的分组里面去
    - 从而完成分包以及整合的过程
    - 通过分组的方式，我们可以把代码包拆分得更细，可以更加充分地利用浏览器缓存。在 http2.0 的场景下，我们可以拆分的这么细，但是 http1.1 可能太细会加重请求，所以我们也要根据实际的场景来
  - `chunk 块的大小`（minSize、maxSize）
  - `引用次数`（minChunks）
  - `最大并行请求数`（maxAsyncRequests、maxInitialRequests）
  - 配置 chunks:all 指的是在做代码分割时，同时对同步导入和异步导入的代码都进行处理
    - initial 只对静态导入的模块有效
    - async 只对动态导入的模块有效
- `好处`：通过更细颗粒度的分包，可以让我们充分地利用浏览器缓存
- 针对框架包，我们还可以通过配置 externals 属性 或者 使用 DllPlugin 两种方案，来进一步把他们单独抽离出去，这样 webpack 编译的时候跳过这些包，然后再通过额外引入的方式，在 html 上引入回来。不仅可以提升打包速度，还减少了整体的包大小
  - 第一个方案配置 externals 属性去让 webpack 跳过框架包的打包，然后再手动地在 html 上把静态资源（cdn 地址）引入回来（这个方案涉及手动操作 html 可能不太好）
    externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    },
  - 第二种方案是使用 dllplugin 插件，配置 dll.config.js 文件，制定相关的框架包（vue 和 vue-router）的打包流程，把他们单独打包出去，然后在项目中通过引入 webpackReferencePlugin 插件，跳过那些被单独打包出去的包，直接去指定的一个静态目录地址去进行加载

## tree shaking

- 目的
  - 删除导出、定义未被使用的 js 代码，减少包体积
- 原理
  - 根据 esm 模块的静态特性，分析代码的 ast 抽象语法树以及模块导入和导出之间的关系
  - Make 阶段，`收集`模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中（module 对象的 exportsInfo 属性）
  - Seal 阶段，遍历 ModuleGraph `标记`模块导出变量有没有被使用
  - 最终生成 bundle 产物时，若变量没有被其它模块使用则`删除`对应的导出语句（需要 terser、Uglify 等 DCE 工具配合树“摇”）
- 先决条件（开发环境下自动开启）
  - 使用 esm 规范编写模块代码
  - 配置 optimization.usedExports 为 true，启动标记功能
  - 启动代码优化功能，可以通过如下方式实现：
    - 配置 mode = production
    - 配置 optimization.minimize = true
    - 提供 optimization.minimizer 数组
- 为什么 esm 适合做 tree shaking
  - esm 导入导出语句只能出现在模块顶部，容易做静态分析，把各模块导入导出的关系确定下去
  - 其他模块化方案更加动态，难以预测
- tree shaking 失效情况
  - Babel 转译模块导入导出语句（将 babel-preset-env 的 modules 配置项设置为 false，关闭模块导入导出语句的转译）
  - 优化导出值的粒度，export default 改成 export 导出

[Webpack 原理系列九：Tree-Shaking 实现原理](https://juejin.cn/post/7002410645316436004)

## 依赖图原理

- `模块依赖图（ModuleGraph）`
  - 从入口文件开始解析生成 AST（通过@babel/parser 把文件内容转换成 AST 抽象语法树）
  - 分析 AST 中的 import 或 require 语法（通过@babel/traverse），收集相关依赖模块的信息（模块路径）放到当前 module 对象的 dependencies 数组中
  - 然后递归遍历 dependencies 中相关联的模块
  - 最终构建好整个模块依赖图（ModuleGraph）
- `分块依赖图（ChunkGraph）`
  - 在模块依赖图（ModuleGraph）的基础上构建分块依赖图（ChunkGraph）
  - 从入口文件开始构建 chunk，根据一定策略，关联 module 和 chunk，让一个 module 属于哪个 chunk，一个 chunk 又包含哪些 module
  - 最终构建好完整的分块依赖图（ChunkGraph）
- 依赖图在 webpack 中扮演着至关重要的角色，通过依赖图去做 tree shaking 以及生成最终的 bundle 文件

[webpack 原理 - ModuleGraph 原理](https://juejin.cn/post/7138285996500025352)
[webpack 原理 - ChunkGraph 解析【分包规则】](https://juejin.cn/post/7141067021734641671)

## 分包后，不同的 chunk 加载顺序如何保证

- 先加载依赖的 chunk，记录起来
- 加载完所有依赖的 chunk，再执行当前的模块代码，保证执行顺序

[webpack 模块化解析原理](https://zhuanlan.zhihu.com/p/541678059)
