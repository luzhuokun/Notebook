## DOMContentLoaded和Onload的区别

- 当html页面上的DOM加载完成时即触发DOMContentLoaded，不等css、js和图片的全部加载完成，注意：DOMContentLoaded 事件必须等待其所属script之前的样式表加载解析完成才会触发
- onload事件是等到所有css、js、图片等资源加载加载完成

## onload的坑

- document上挂载onload不会触发，window上才可以
```js
  // 正常监听
  window.onload = function (event) {};
  window.addEventListener('load',function(event){});
  // 失效
  document.onload = function (event) {};
  document.addEventListener('load',function(event){});
```
?>注意：部分事件window和document上都会有，比如DOMContentLoaded

## server send event
sse利用html5的EventSource实现服务器向浏览器单向地推送消息，除了IE不支持  
http://www.ruanyifeng.com/blog/2017/05/server-sent_events.html

## html5新特性
``2012稳定版本``

- 语义标签
- 增强表单
- 视频和音频
- canvas
- svg
- 地理定位
- 拖放api
- webworker
- websocket
- webstorage

!> https://juejin.im/post/6844903829679390728

## BFC布局规则
