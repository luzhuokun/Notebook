
## 移动端页面适配方案

- meta viewport
- css3 @media媒体查询
- 动态rem方案 [flexible布局](http://caibaojian.com/flexible-js.html)
- vw/vh
- flex布局
- grid布局

[移动端Web页面适配方案（整理版）](https://www.jianshu.com/p/2c33921d5a68)

## First Paint、DOMContentLoaded和Onload的区别

- `First Paint`是指html中第一个script执行之前dom的渲染和cssom的构建情况
- `DOMContentLoaded`是HTML文档被加载以及解析完成后触发，即HTML解析为DOM后触发
  - 特点1：解析完成是指同步代码执行完，不等异步
  - 特点2： async脚本可能会在DOMContentLoaded之前或之后执行，就是说async脚本如果加载好了，HTML解析会去执行脚本，脚本执行完再触发DOMContentLoaded
- `load`事件触发是指一个完全加载页面，包括所有资源下载完毕的过程
  - 1.`load`一般在`DOMContentLoaded`之后触发，当页面上没有什么外链请求的时候，`load`会跑到`DOMContentLoaded`前面
  - 2.`load`会等script上的微任务
  - 3.当在`script`中又动态引入`script`时，`DOMContentLoaded`会在他之前执行，`load`会等这个动态加载的script完成

?>
[DOMContentLoaded 与 load事件](https://blog.csdn.net/liubangbo/article/details/86298859)  
[Chrome的First Paint触发的时机探究](https://www.cnblogs.com/hongrunhui/p/8929001.html)  


## onload的坑

- document上挂载onload不会触发，window上才可以
```js
  // 正常监听
  window.onload = function (event) {};
  window.addEventListener('load',function(event){});
  // 失效 浏览器上没有对document的onload做响应
  document.onload = function (event) {};
  document.addEventListener('load',function(event){});
```

- document上，onload事件只在body、frame、frameset、iframe、img、link、script上有

?>
注意：部分事件window和document上都会有，比如DOMContentLoaded  

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

- bfc里面的元素垂直布局，块元素占一行、内联元素占一行
- bfc里面的相邻元素的`垂直方向`的margin会发生`重叠`
- bfc里面的子元素紧贴父元素内容区的左边
- bfc不会和float`浮动`元素重叠（position会）
- bfc会产生`隔离`容器，bfc内的布局不会影响外面的布局
- bfc内部计算高度时会包含浮动元素的高度(position不计算在内)

### 如何创建BFC

- 根元素html
- float值不为none
- position值为absolute和fixed (static、relative、sticky不能产生BFC)
- display值为inline-block、table-cell、flex、table-caption、inline-flex
- overflow的值不为visible

### BFC作用

- 避免margin重叠
- 自适应两栏布局
- 清除浮动，解决高度塌陷问题 （推荐父元素使用:after伪类添加clear:both属性来清楚浮动，需要注意的是该方法不会产生BFC）
- 清除字体环绕

## form

form表单是允许跨域发起请求的，因为表单递交的时候页面是会刷新的，不会把结果返回到页面上，所以浏览器是认为安全的

## 标签设rel为prefetch、preload
- `preload`主要用于预加载`当前页面`需要的资源(1.调整资源优先级，2.把加载和执行分开)
- `prefetch`主要用于加载`将来页面`可能需要的资源(也就是说为下一个页面的加载速度做准备)  
[关于Preload，你应该知道些什么](https://blog.csdn.net/hsany330/article/details/88682999)

## 懒加载和预加载
- `懒加载`当图片进入可见区域时才加载图片并设图片src  
- `预加载`提前把图片请求并缓存起来，当需要使用时直接渲染  
[懒加载与预加载的区别详细](https://blog.csdn.net/ca817586/article/details/78665198)

## 骨架屏
界面加载过程中的过渡效果，在网速慢的时候显示页面的结构图比白屏的视觉效果要好  
[Vue项目骨架屏注入实践](https://cloud.tencent.com/developer/article/1356681)

## async和defer
- `async` 下载和执行都是异步
- `defer` 异步下载，script延时至元素解析完，DOMContentLoaded触发之前完成
- `load` 都会等`async`和`defer`完成后触发（window的onload事件触发会等到这两种script加载完再执行，如果不想等的话，可以用preload的异步用法来实现）

## 事件模型

- 监听
  - HTML的on-属性
  - dom节点的on+事件名，比如 div.onclick=funciton(){}
  - dom.addEventListener
- this指向
  - 监听事件中的this指向触发事件的那个dom元素
- 传播
  - 捕获阶段
  - 目标阶段
  - 冒泡阶段 (不是所有事件都能冒泡，blur、focus、load、unload不冒泡)
  - event.stopPropagation() 阻止传播 (IE不支持该方法)，如果addEventListener给事件定义了多个监听函数，那么多个监听函数还是会执行，只是传播被阻止了而已，如果想阻止传播并不触发其他函数执行则调用stopImmediatePropagation
  - event.stopImmediatePropagation() 取消所有该事件触发
  - event.cancelBubble = true 阻止冒泡行为
  - event.preventDefault() 阻止默认行为
- 事件代理
  - 由父节点监听函数统一处理多个子元素的事件
