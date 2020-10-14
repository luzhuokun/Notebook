
## Memory分析内容泄露

- Heap snapshot - 用以打印堆快照，堆快照文件显示页面的 javascript 对象和相关 DOM 节点之间的内存分配
- Allocation instrumentation on timeline - 在时间轴上记录内存信息，随着时间变化记录内存信息。
- Allocation sampling - 内存信息采样，使用采样的方法记录内存分配。此配置文件类型具有最小的性能开销，可用于长时间运行的操作。它提供了由 javascript 执行堆栈细分的良好近似值分配。

?> https://www.cnblogs.com/ys-ys/p/11336811.html

## JavaScript引擎
- JavaScriptCore（safari、WebKit的默认JavaScript引擎、iOS及ios内小程序）
- v8（Google、Android浏览器）
- Carakan（Opera）
- SpiderMonkey/TraceMonkey/JagerMonkey(对应Mozilla Firefox 1.0~3.0、3.5~3.6、4.0以上)
- Chakra（微软IE9.0以上）
- JScript（IE3.0~IE8.0）
- JSCore （Android小程序）
- nwjs（IDE微信开发工具，由 Chrome Webview 来渲染）
?>
[常见的JavaScript引擎](https://leowang721.github.io/2017/03/21/js/javascript-engine/)
[javascriptCore全面解析](https://www.cnblogs.com/qcloud1001/p/10305293.html)

## 渲染引擎
- webkit（Chrome、safari、opera、IOS小程序）
- trident（IE、edge）
- gecko(Mozilla Firefox 是基于 Gecko 开发)
- blink（2013年4月，谷歌利用 WebKit 渲染引擎开发自主的网页渲染引擎Blink，同时Opera也跟随Google的步伐）
- X5（微信、QQ浏览器基于webkit的增强内核、Android小程序）
