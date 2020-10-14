## setData的一些问题
https://www.cnblogs.com/kuailingmin/p/11392704.html

### setData运行原理
- 当小程序触发setData的时候，会先把数据转换为字符串，然后再通过evaluateJavaScript传递给webview和JavaScriptcore
- 小程序的视图层和逻辑层分别运行在不同的线程，因此改变逻辑不会阻塞视图层渲染

## 性能优化
https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html

## wepy
https://tencent.github.io/wepy/

## mpvue
http://mpvue.com/

## 原生开发小程序 和 wepy 、 mpvue 对比
https://www.jianshu.com/p/90ca4aaf443e
