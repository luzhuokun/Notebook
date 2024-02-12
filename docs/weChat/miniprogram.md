## 介绍一下小程序架构原理

- 小程序是`双线程架构`运行模式，逻辑层和渲染层分别由两个线程管理，逻辑层通过 JSCore 执行 js 代码，渲染层通过 webview 渲染
- 逻辑层和渲染层之间不能直接通信，通过 native 层进行转发，在逻辑层中调用 JSBridge 的 api，经过 native 层处理，通知渲染层进行渲染工作
- 双线程架构的好处是不存在 js 阻塞渲染的问题，用户体验更好

[微信小程序底层框架实现原理](https://xie.infoq.cn/article/27aa070e20fbe4782b50cae3d)

## setData 的一些问题

- 频繁调用 setData 会造成性能问题，因为双线程架构，每次调用 setData 都会有一定的线程通信的消耗，并且小程序没有对 setData 做浅比较之类的优化处理，并且每次调用 setData 都会触发重渲染，需要用户手动优化
- 应手动优化尽量减少 setData 调用

[微信小程序的 setData](https://www.cnblogs.com/kuailingmin/p/11392704.html)

### setData 运行原理

- 当小程序触发 setData 的时候，会先把数据转换为字符串，然后再通过 evaluateJavaScript 传递给 webview 和 JavaScriptcore
- 小程序的视图层和逻辑层分别运行在不同的线程，因此改变逻辑不会阻塞视图层渲染

## 性能优化

- （非必要不频繁）不要频繁地调用 setdata
- （控制调用颗粒度）setData 应只传发生变化的数据，合并连续调用
- （不可见时不调用）切换到后台后不要进行 setdata 操作，比如倒计时更新任务

[合理使用 setData](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/runtime_setData.html)

## 登录流程

- 在小程序中调用 `wx.login`获取`临时 code`
- 调用 `wx.request` 把临时 code 交给后台
- 后台根据临时 code、appid、appSecret 等信息，调用微信服务器的接口，获取 `session_key`、`openId`、`unionId`
- 后台保存 `session_key`(跟用户相关) 以及 `openid`相关信息
- 然后创建后台和用户之间的`登录态`返回给用户，完成登录流程

[小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)

## 小程序中使用 websocket 需要注意

- 只支持 `wss` 和 `https`
- 单次发送`大小`不能超过 1M
- `兼容性`问题（需要看文档）

## 技术选型

- 微信原生
- vue：uni-app、mpVue
- react：taro

## openId 和 unionId 区别

- openId 用于唯一标识小程序
- unionId 用于在多个关联的小程序中唯一标识用户，需要关联在同一个微信开放平台的账号下

## 小程序分包策略

- 将项目中的页面按照功能或模块进行分类,并确定哪些页面可以独立成子包
- 程序项目由 1 个主包 + 多个分包组成
- 小程序分包的大小有以下两个限制
  - 整个小程序所有分包大小不超过 16M（主包 + 所有分包）
  - 单个分包/主包大小不能超过 2M
- 小程序会按 subpackages 的配置进行分包，subpackages 之外的目录将被打包到主包中
  - 设置对应的 name 名称、root 路径、以及包含的子项目 pages 地址
