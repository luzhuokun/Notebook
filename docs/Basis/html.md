
## 移动端页面适配方案

- meta viewport
- css3 @media媒体查询
- 动态rem方案 [flexible布局](http://caibaojian.com/flexible-js.html)
- vw/vh
- flex布局

[移动端Web页面适配方案（整理版）](https://www.jianshu.com/p/2c33921d5a68)

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
Content-Type: text/event-stream  
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

## BFC布局

Block formatting context 块级格式化上下文

### BFC定义

BFC是一个独立的布局环境，其中的元素布局不受外界影响，并且在BFC中，块盒与行盒都会垂直地沿着父元素的边框排列。

### BFC内的布局规则

- bfc中的元素垂直布局，块元素占一行、内联元素占一行
- bfc中的相邻元素的垂直方向的margin会发生重叠
- bfc中的子元素紧贴父元素内容区的左边
- bfc不会和float浮动元素重叠
- bfc会产生隔离容器，bfc内的布局不会影响外面的布局
- bfc计算高度时会包含浮动元素的高度

### 如何创建BFC

- 根元素
- float值不为none
- position值不为static
- display值为inline-block、table-cell、flex、table-caption、inline-flex
- overflow的值不为visible

### BFC作用

- 避免margin重叠
- 自适应两栏布局
- 清除浮动，解决高度塌陷问题 （推荐父元素使用:after伪类添加clear:both属性）
- 清除字体环绕

## form

form表单是允许跨域发起请求的，因为表单递交的时候页面是会刷新的，不会把结果返回到页面上，所以浏览器是认为安全的
