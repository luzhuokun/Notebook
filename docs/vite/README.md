## 介绍一下 vite

- Vite 是一个基于 ESModule 打包的构建工具，通过原生支持的 ESModule 语法进行模块的导入和导出，在`开发阶段`省去了打包编译的时间，并且使用 esbuild 做预处理优化，把一些不是 ESM 格式的模块`转成 ESM 格式`；把多个 ESM 模块组合成一个，`减少 http 请求`的发起，在`生产阶段`使用 rollup 进行编译打包
  - esbuild 基于 go 语言开发，利用多线程
    - 优点
      - 对非 esm 模块转 esm 模块
      - 合并模块，减少 http 请求
    - 缺点
      - 对 css 分割不友好
- 特点
  - 快速冷启动，即时热更新，并利用浏览器缓存
  - 真正的按需加载，基于 esm 的 HMR 在模块发生变化时，只需要重新加载变动的模块就可以
- 弊端
  - 开发环境和生产环境构建不一致，可能线上出现后难以定位和复现的问题

### vite 构建原理

- 生产
  - 基于 rollup，以入口 js 文件开始，解析文件中的代码，转换成 ast，分析 import 语法，构建依赖图，把模块按一定的规则打包到一块，最终输出目标文件
- 开发
  - 利用浏览器原生支持 esmodule，遇到 import 语法就发起一个 http 请求去加载文件
  - vite 启动一个 koa 服务器拦截这些请求，在后端对相关请求的文件做一定的处理（分解与整合，比如将 Vue 文件拆分成 template、style、script 三个部分），并以 esmodule 的格式返回给浏览器

### Vite 与 webpack 比较

- Vite 相比 webpack 在开发阶段省去了编译打包的时间，充分利用浏览器原生的 esm 特性（webpack 需要整合多个资源到一个 bundle 才能供给使用）
- Vite 打包使用 esbuild，esbuild 是由 go 语言开发的，充分利用高并发和编译语言的能力

## vite 优化

- 优化前，先通过 rollup-plugin-visualizer 分析包体关系和大小
- `手动分包`，通过在 vue.config.js 配置中设置 manualChunks （对象/函数），自定义分割策略
  - 除了入口点（静态入口点、动态入口点）单独生成一个 chunk 之外，当一个模块被两个或以上的 chunk 引用，这个模块需要单独生成一个 chunk。
  - 统一把不经常变动的第三方包放入 vendor 包中，合理解决 chunk 碎片问题，减少网络请求
- `启动压缩`，输出 gzip
- `手动配置terser插件`，vite 默认自动通过 esbuild 做多线程编译、压缩等操作

## vite5 特点

- 使用 rollup4，构建性能大幅度提升
- 弃用 cjs node api 导入模块
- 下一个版本 vite6，将使用 rolldown 作为内部的构建工具，替换掉 rollup 和 esbuild, rolldown 是尤雨溪团队开发的一个 rust 版的 rollup

[Vite 5.0 正式发布](https://juejin.cn/post/7301910888957411367)
