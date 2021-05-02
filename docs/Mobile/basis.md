
# 移动APP开发模式

  - web app
  需要运行在浏览器上
  只能使用有限的移动硬件设备能力，性能差
  - native app
  基于手机的操作系统使用原生语言开发
  开发成本高周期长
  - hybrid app
  以webview作为载体，以h5做呈现，同时有使用原生app的能力，结合了web和native app开发的优点

## 现在比较流行的hybrid开发方案
  主要区别在UI渲染机制上
 - 基于`webview`渲染，通过JSBridge完成h5和native的双向通信，如`微信js-sdk`
 - 基于`Native`渲染，在H5原生api能力上，再进一步通过JSBridge讲js解析成`虚拟节点`树传递给Native进行`原生渲染`，如`react-native`、`weex`
 - 通过定制化的JSBridge，使用`双线程的模式`，`隔离`了`js逻辑层`和`UI渲染层`，提高页面性能及开发体验

https://seminelee.com/2019/05/08/rn-miniprogram/
