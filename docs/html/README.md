## HTML 第一行 !DOCTYPE html 的作用

- 声明标准的 W3C 文档规范解析页面
- 如果不声明浏览器会按自己的方式渲染页面，会出现怪异的情况

## body 标签中出现 script 标签，浏览器怎么处理

- 浏览器逐行解析 html 上的标签，遇到 script 标签会暂停 html 的解析，然后去对 script 标签进行处理
- script 标签的处理分`两种情况`，第一种是 script 标签如果是一个`内联js代码`的话会直接解析执行；如果是带有 src 属性，请求外部 js 文件，会先进行文件的`下载`然后再`解析`，此时下载跟解析都是`同步`进行的，会`阻塞` html 的解析
- 通过 async 和 defer 属性可以`优化` script 标签的处理
- 然后通过 js 引擎解释执行 script 标签中的 js 代码

[JS 代码运行的时候发生了什么](https://juejin.cn/post/7269684436538114106)  
[【HTML】深入讲解浏览器渲染原理](https://blog.csdn.net/XiugongHao/article/details/133972585)

### async 和 defer 的区别

- async 异步下载，`立即执行`，多个不保证执行顺序
  - 执行时阻塞 html 解析
- defer 异步下载，`延迟执行`，多个带有 defer 属性的 script 标签`按定义顺序执行`
  - 延迟到 html 解析完，DOMContentLoaded 事件触发前执行
- 两者最终都会在 onload 事件触发之前执行
- 场景
  - defer
    - 需要操作页面的场景，比如给 dom 添加事件绑定、改变 dom 位置大小等等
  - async
    - 适合`不需要操作页面`也不需要依赖其他 script 脚本的场景，适合只是做`单纯计算`、数据上报等场景

[浏览器渲染原理](https://www.jianshu.com/p/d12651ad453b)

### 为什么 script 标签要放到 body 底部

- `减少白屏时间`，因为 js 的解析会阻塞 html 的解析进而阻塞渲染，所以把 js 放 body 底部，让 html 先解析完成，先让用户看到页面，增强用户体验
- `避免操作dom失效`，js 无法操作位于它下方的 dom，因为此时 dom 还没构建出来，所以 script 放 body 底部，等 html 解析完成后，再进行 js 操作

### 为什么 script 下载会阻塞 html 的解析

- 如果 js 下载不阻塞 html 解析的话，就会有可能出现 dom 解析完，再解析 js，就达不到`同步的执行效果`了，代码会出现很多不确定性的因素，特别是在多个 script 都对 dom 进行了操作的情况
- `浏览器解析是逐行进行的`，解析到对应的 script 标签才去下载，一旦下载就必须等它执行完，由于浏览器以前`没有做特殊的优化`所以会阻塞 html 解析
- 后来通过 async 和 defer 来优化这一个阻塞问题

### css 为什么不会阻塞 html 的解析

- css 的下载和解析在不同的线程上进行，下载和解析 css 的工作在`预解析线程`中进行，html 的解析在`渲染主线程`上进行
- 如果此时外部的 css 还没下载解析好，html 的解析也不会暂停，继续解析
- css 虽然不会阻塞 html 的解析，但是会阻塞 js 的解析，因为 js 中会访问到 css 的东西，所以如果不阻塞的话就会拿到错误的样式

### css 为什么放 head

- css 会阻塞 js 解析，尽快地下载 css 并解析，进而更快地对 js 进行解析，降低白屏时间

## canvas 和 svg 的区别

- canvas 渲染图片的时候会`失真`，svg 不会失真是矢量图渲染
- canvas 中的元素不支持`点击事件`，svg 中的元素支持点击事件
- canvas `重渲染`时不会引起大面积的重绘重排，svg 会
- canvas 更适合`频繁绘制`场景，比如游戏动画等等；svg 更适合`频繁交互`场景，比如地图、脑图

### 用 canvas 画直线

- ctx = document.getElementById('myCanvas').getContext(2d)
- ctx.beginPath();
- ctx.moveTo(50,50);
- ctx.lineTo(150,150);
- ctx.stroke();

- ctx.arc(centerX, centerY, radius, startAngle, endAngle); // 绘制圆形路径

## 事件绑定

- 以添加 click 事件为例
- 原生
  - 内联，在标签上绑定一个 onclick 方法
  - .onclick，获取到 dom 对象然后挂在 click 方式
  - .addEventListener
- vue
  - @click
- react
  - onClick

## 图片懒加载

- 让图片出现在可视区时再加载图片
- 实现方式（2 种）：
  - 监听`onScroll`
    - 计算方式（2 种）：
      - 根据`scrollTop`，判断容器的 scrollTop（变） + offsetHeight 与元素的 offsetTop 的大小，此 offsetTop 是元素到`内容顶部`距离
        - scrollHeight = scrollTop + offsetHeight + 下部未露出部分
      - `getBoundingClientRect`，通过调用元素的 getBoundingClientRect 方法获取元素的 top 值，该 top 值是元素到`可视区顶部`距离
  - 给每个图片元素创建`IntersectionObserver`实例监听，监听元素是否出现在可视区内

## meta 标签的作用

- 用于描述页面特征

## 对 viewport 的理解

- viewport 是 html 标签 meta 中用来做移动端适配的
- viewport 有三种
  - layout viewport（布局视口），一般是 980px
  - visual viewport（视觉视口），物理机的实际屏幕大小
  - ideal viewport（理想视口），设置 width=device-width

## 什么情况会引起重排

- 当页面布局、节点的几何信息（大小、边距、位置）、窗口大小、文字大小发生变化就会引起重排
- 重排一定引起重绘，重绘不一定引起重排
- 重绘是指外观、背景、颜色发生改变

### 引起重排的属性方法有

- width、height、margin、padding
- border
- left、top
- scroll offset client（top、left、width、height）
- getBoundingClientRect()

### 重排带来什么影响

- 重排会重新计算元素的布局信息，重新生成渲染树
- 频繁的重排会造成页面响应变慢、卡顿闪烁等现象

### 如何避免重排

- 把 dom 元素设置成 `BFC`，独立渲染，内部重排不影响外部
- `避免频繁`查询布局信息，如 offsetWidth、offsetHeight
- 对元素进行复杂的操作，可以`先隐藏`，操作完再显示
- 使用文档片段 `DocumentFragment`，批量创建再一次性添加到文档中
- 动画操作`提升合成层`，使用 GPU 硬件加速
  - will-change
  - transform
  - opacity
  - filter
