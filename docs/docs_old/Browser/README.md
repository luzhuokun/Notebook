## Memory 分析内容泄露

- Heap snapshot - 用以打印堆`快照`，堆快照文件显示页面的 javascript 对象和相关 DOM 节点之间的内存分配
- Allocation instrumentation on timeline - 在时间轴上记录内存信息，随着时间变化记录内存信息。
- Allocation sampling - 内存信息采样，使用采样的方法记录内存分配。此配置文件类型具有最小的性能开销，可用于长时间运行的操作。它提供了由 javascript 执行堆栈细分的良好近似值分配。

?> https://www.cnblogs.com/ys-ys/p/11336811.html

## JavaScript 引擎

- JavaScriptCore（safari、WebKit 的默认 JavaScript 引擎、iOS 及 ios 内小程序）
- v8（Google、Android 浏览器）
- Carakan（Opera）
- SpiderMonkey/TraceMonkey/JagerMonkey(对应 Mozilla Firefox 1.0~3.0、3.5~3.6、4.0 以上)
- Chakra（微软 IE9.0 以上）
- JScript（IE3.0~IE8.0）
- JSCore （Android 小程序）
- nwjs（IDE 微信开发工具，由 Chrome Webview 来渲染）
  ?>
  [常见的 JavaScript 引擎](https://leowang721.github.io/2017/03/21/js/javascript-engine/)
  [javascriptCore 全面解析](https://www.cnblogs.com/qcloud1001/p/10305293.html)

## 渲染引擎

- webkit（Chrome、safari、opera、IOS 小程序）
- trident（IE、edge）
- gecko(Mozilla Firefox 是基于 Gecko 开发)
- blink（2013 年 4 月，谷歌利用 WebKit 渲染引擎开发自主的网页渲染引擎 Blink，同时 Opera 也跟随 Google 的步伐）
- X5（微信、QQ 浏览器基于 webkit 的增强内核、Android 小程序）

## requestIdleCallback 和 requestAnimationFrame

- `requestAnimationFrame` 在页面重绘重排前执行
- `requestIdleCallback` 会在渲染完成后，浏览器有空闲时执行，有可能浏览器一直忙碌而导致该方法很晚才执行，所有可以设置 timeout 超时时间，那么会在超时后的下一帧强制执行

[requestIdleCallback 和 requestAnimationFrame 详解](https://www.jianshu.com/p/2771cb695c81)

## scheme 协议

通过 scheme 协议，以页面跳转的方式打开本地 app 应用
