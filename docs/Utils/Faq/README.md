## 数组内元素逐一执行同一个异步函数
[filename](./test.js ':include')

## 不断减速的递归
[filename](./test1.js ':include')

## new的使用问题
```js
var a = function(){this.x=111};
a.b=function(){this.y=222};
new a; // {x:111}
new a().b; // undefined
new a.b(); // {y:222}
```

## websocket、http和tcp的区别
https://www.cnblogs.com/merray/p/7918977.html  
应用层 http、websocket  
会话层 socket  
传输层 tcp  (最重要)
网络层 ip  
链路层 以太网 ARP RARP  

## 前端性能优化
1. 减少http请求和报文大小
2. 设置缓存和长连接
3. 优化代码（闭包要注意消耗对象和减少dom操作）

## rollup和webpack使用场景分析
https://www.jianshu.com/p/60070a6d7631
- rollup多用于js库构造，而webpack更多用于前端工程
- 如果只是想只想做js代码转换，可以使用rollup
- 如果代码中涉及css、html和复杂的代码拆分合并工作，则用webpack

## AMD、CMD、ESM和CommonJS
https://www.cnblogs.com/chenwenhao/p/12153332.html
- CommonJS规范主要应用于nodejs，四个重要的环境变量为module、exports、require、global。exports只是module.exports的全局引用，实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports）
- AMD规范采用异步方式加载模块，用require.config()指定引用路径，用definde()定义模块，用require()加载模块。
- CMD与ADM很类似，不同点在于AMD提前引入模块，CMD可以按需引入模块。
- ESM在ES6语法标准化后实现了模块功能，其模块功能语法主要包括export和import

## webpack打包后生成app、vendor、manifest区别
vendor.js 默认是把node_modules里require的依赖打包到这个bundle上去
mainfest.js 在vendor的基础上，将一些异步加载打包进去
app.js 主要放我们自己写的js代码等
分离出这些文件，主要是想利用浏览器缓存，node_modules中的代码都不是常变化的话，因此用户在访问的时候，就不需要重新下载他们了。

## 客户端渲染、服务器渲染（SSR）和预渲染（Prerendering）
- 在前后端分离的背景下，把渲染页面的工作放在前端中进行，如react、vue、angular等主流框架。
- 服务器渲染就是以前不分离的做法，把渲染页面的工作在后端进行，优势主要在于SEO和更快的内容显示，但是服务器渲染会加重服务器的负载，不过可以采用缓存策略降低负载。
- 预渲染则是在打包的时候打成多个HTML文件，如果你只是用来改善少数不经常改动的页面，则使用预渲染比服务器渲染更合适。[服务器端渲染 vs 预渲染](https://ssr.vuejs.org/zh/) [vue框架的预渲染实现问题](https://zhuanlan.zhihu.com/p/99318865)
