## HTML 第一行 !DOCTYPE html 的作用

- 声明标准的 W3C 文档规范解析页面
- 如果不声明浏览器会按自己的方式渲染页面，会出现怪异的情况

## async 和 defer 的区别

- 在 script 标签上设置 async 和 defer 都会立即下载脚本并且不会阻塞 dom 的解析，并且最终都会在 onLoad 事件触发前执行
- 不同的是，async 会在脚本下载完成后会`立即`阻塞渲染执行当前的脚本，defer 会等到当前 html 解析完成后，DomContentLoaded 事件(document.ready 这是一个 jquery 语法)`触发`之`前`执行
- async 属性的脚本不会按顺序执行，如果都加载好的情况下 defer 属性的脚本会按定义的顺序执行

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
- 频繁的重排会造成页面响应速度变慢、页面卡顿闪烁等现象

### 如何避免重排

- 合并多次渲染
- 把要多次重渲染的节点脱离文档流或隐藏起来进行 dom 操作
- 提升合成层，使用 GPU 硬件加速
  - will-change
  - transform
  - opacity
  - filter
