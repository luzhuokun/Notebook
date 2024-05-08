## h5 和移动 app 通信

- 通过 webview 渲染，通过 window 上的 WebViewJavascriptBridge
  - callHandler(name,data,cb)
  - registerHandler(name,cb)

## [鸿蒙](https://hmxt.org/)

- [开发文档](https://device.harmonyos.com/cn/develop/)
- [入门资料](https://space.bilibili.com/2029471800/channel/collectiondetail?sid=1412842&spm_id_from=333.788.0.0)

## 小程序开发

### taro

- 一个多端统一开发的解决方案
- 使用 webpack 打包，esbuild 预编译
- 开发目录在 src，打包目录在 dist 上
- 打包结果，根据目标平台来定
- webpack-bundle-analyzer
- 当不能做到一套代码处理不同端逻辑时
  - 使用内置环境变量去区分不同平台
    - process.env.TARO_ENV === 'h5'
  - 统一接口的多端文件，通过不同的命名方式

[Taro 介绍](https://taro-docs.jd.com/docs/)
[taro 渐进式入门教程](https://docs.taro.zone/docs/guide/)
