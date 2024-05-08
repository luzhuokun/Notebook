## html5 新特性

`2012稳定版本`

- 语义标签
- 增强表单
- 视频和音频
- canvas
- svg
- 地理定位
- 拖放 api
- webworker
- websocket
- webstorage

!> [CSS3 和 HTML5 新特性一览](https://juejin.im/post/6844903829679390728)

## First Paint、DOMContentLoaded 和 Onload 的区别

- `DOMContentLoaded`是 HTML 文档被加载以及解析完成后触发，即 HTML 解析为 DOM 后触发
  - 特点 1：解析完成是指同步代码执行完，不等异步
  - 特点 2： async 脚本可能会在 DOMContentLoaded 之前或之后执行，就是说 async 脚本如果加载好了，HTML 解析会去执行脚本，脚本执行完再触发 DOMContentLoaded
- `load`事件触发是指一个完全加载页面，包括所有资源下载完毕的过程
  - 1.`load`一般在`DOMContentLoaded`之后触发，当页面上没有什么外链请求的时候，`load`会跑到`DOMContentLoaded`前面
  - 2.`load`会等 script 上的微任务
  - 3.当在`script`中又动态引入`script`时，`DOMContentLoaded`会在他之前执行，`load`会等这个动态加载的 script 完成
- `First Paint`是指 html 中第一个 script 执行之前 dom 的渲染和 cssom 的构建情况

?>
[DOMContentLoaded 与 load 事件](https://blog.csdn.net/liubangbo/article/details/86298859)  
[Chrome 的 First Paint 触发的时机探究](https://www.cnblogs.com/hongrunhui/p/8929001.html)

## onError

- 只能捕获同步任务和宏任务产生的错误
- 不能捕获微任务方法产生的错误

## onload 的坑

- document 上挂载 onload 不会触发，window 上才可以

```js
// 正常监听
window.onload = function (event) {};
window.addEventListener("load", function (event) {});
// 失效 浏览器上没有对document的onload做响应
document.onload = function (event) {};
document.addEventListener("load", function (event) {});
```

- document 上，onload 事件只在 body、frame、frameset、iframe、img、link、script 上有

?>
注意：部分事件 window 和 document 上都会有，比如 DOMContentLoaded

## BFC 布局

Block formatting context 块级格式化上下文

### BFC 定义

BFC 是一个`独立的渲染区域`，其中的元素布局不受外界影响，并且在 BFC 中，块盒与行盒都会垂直地沿着父元素的边框排列。

### BFC 内的布局规则

- bfc 里面的元素垂直布局，块元素占一行、内联元素占一行
- bfc 里面的相邻元素的`垂直方向`的 margin 会发生`重叠`
- bfc 里面的子元素紧贴父元素内容区的左边
- bfc 不会和 float`浮动`元素重叠（position 会）
- bfc 会产生`隔离`容器，bfc 内的布局不会影响外面的布局
- bfc 内部计算高度时会包含浮动元素的高度(position 不计算在内)

### 如何创建 BFC

- 根元素 html
- float 值不为 none
- position 值为 absolute 和 fixed (static、relative、sticky 不能产生 BFC)
- display 值为 inline-block、table-cell、flex、table-caption、inline-flex（flex 解决父子坍塌，inline-block 解决兄弟坍塌）
- overflow 的值不为 visible (注意是解决了父子间的 margin 坍塌问题)

### BFC 作用

- 避免 margin 重叠
- 清除浮动，解决高度塌陷问题 （推荐父元素使用:after 伪类添加 clear:both 属性来清楚浮动，需要注意的是该方法不会产生 BFC）
- 自适应两栏布局（flex:1 1 auto）
- 清除字体环绕

### 为什么会有 margin 坍缩

- 主要原因就是 css 在设计之初是作为文档排版的类似于 word 排版，margin 的值就是段落间距，取设置的比较大的部分
- 注意：父子元素也会有 margin 坍缩

## form

form 表单是允许跨域发起请求的，因为表单递交的时候页面是会刷新的，不会把结果返回到页面上，所以浏览器是认为安全的

## 懒加载和预加载

- `懒加载`当图片进入可见区域时才加载图片并设图片 src
- `预加载`提前把图片请求并缓存起来，当需要使用时直接渲染  
  [懒加载与预加载的区别详细](https://blog.csdn.net/ca817586/article/details/78665198)

## 骨架屏

界面加载过程中的过渡效果，在网速慢的时候显示页面的结构图比白屏的视觉效果要好  
[Vue 项目骨架屏注入实践](https://cloud.tencent.com/developer/article/1356681)

## 事件模型

- 监听
  - HTML 中元素直接写 on+属性名 比如 <div onclick='handel()'></div>
  - dom 节点对象添加 on+事件名，比如 div.onclick=funciton(){}
  - dom.addEventListener
- this 指向
  - 监听事件中的 this 指向触发事件的那个 dom 元素
- 传播
  - 捕获阶段
  - 目标阶段
  - 冒泡阶段 (不是所有事件都能冒泡，blur、focus、load、unload 不冒泡)
  - event.stopPropagation() 阻止传播 (IE 不支持该方法)，如果 addEventListener 给事件定义了多个监听函数，那么多个监听函数还是会执行，只是传播被阻止了而已，如果想阻止传播并不触发其他函数执行则调用 stopImmediatePropagation
  - event.stopImmediatePropagation() 取消所有该事件触发
  - event.cancelBubble = true 阻止冒泡行为
  - event.preventDefault() 阻止默认行为
- 事件代理
  - 由父节点监听函数统一处理多个子元素的事件
