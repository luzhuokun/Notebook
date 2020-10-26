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
- 应用层 http、websocket
- 表示层
- 会话层 socket  
- 传输层 tcp  (最重要)
- 网络层 ip  
- 数据链路层 以太网 ARP RARP  
- 物理层

https://www.cnblogs.com/merray/p/7918977.html  

## 前端性能优化
1. 减少http请求和报文大小
2. 设置缓存和长连接
3. 优化代码（闭包要注意消耗对象和减少dom操作）

## rollup和webpack使用场景分析
https://www.jianshu.com/p/60070a6d7631
- rollup多用于js库构造，而webpack更多用于前端工程
- 如果只是想对js代码转换，可以使用rollup
- 如果代码中涉及css、html和复杂的代码拆分合并工作，则用webpack

## AMD、CMD、ESM和CommonJS
https://www.cnblogs.com/chenwenhao/p/12153332.html
- CommonJS规范主要应用于nodejs，四个重要的环境变量为module、exports、require、global。exports只是module.exports的全局引用，实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接用exports）
- AMD规范采用异步方式加载模块，用require.config()指定引用路径，用definde()定义模块，用require()加载模块。
- CMD与ADM很类似，不同点在于AMD提前引入模块，CMD可以按需引入模块。
- ESM在ES6语法标准化后实现了模块功能，其模块功能语法主要包括export和import

## Common和ESM的区别
- Common输出的内容是浅拷贝的，ESM则是引用的
- Common在运行阶段加载模块，ESM在解析阶段生成接口并对外输出
- ESM输出的内容只读，如果输出的内容是变量的话，属性还是可以修改的。

## webpack打包后生成app、vendor、manifest区别
vendor.js 默认是把node_modules里require的依赖打包到这个bundle上去
mainfest.js 在vendor的基础上，将一些异步加载打包进去
app.js 主要放我们自己写的js代码等
分离出这些文件，主要是想利用浏览器缓存，node_modules中的代码都不是常变化的话，因此用户在访问的时候，就不需要重新下载他们了。

## 客户端渲染、服务器渲染（SSR）和预渲染（Prerendering）
- 在前后端分离的背景下，把渲染页面的工作放在前端中进行，如react、vue、angular等主流框架。
- 服务器渲染就是以前不分离的做法，把渲染页面的工作在后端进行，优势主要在于SEO和更快的内容显示，但是服务器渲染会加重服务器的负载，不过可以采用缓存策略降低负载。
- 预渲染则是在打包的时候打成多个HTML文件，如果你只是用来改善少数不经常改动的页面，则使用预渲染比服务器渲染更合适。[服务器端渲染 vs 预渲染](https://ssr.vuejs.org/zh/) [vue框架的预渲染实现问题](https://zhuanlan.zhihu.com/p/99318865)

## 浏览器渲染流程
parse html (生成dom和cssdom，合并成render tree) -> javascript -> style (Recalculate Style计算样式)-> layout (重排) -> paint（重渲染） -> composite (Composite Layers 合成图像)

## mvc和mvvm的区别
- mvc就是在controller中把model的数据赋值给view，view向controller发出动作指令，controller选择model驱动视图更新
- mvvm就是viewModel实现了数据的双向绑定，view和model不直接通信

## react和vue的比较
- react需要手动优化组件渲染
- JSX写法 template模版写法
- css作用域方面也是通过js来控制，vue中使用style scoped来控制
- 社区支持 官方支持

## vue响应式原理
vue通过数据劫持和发布订阅者模式的方法，利用Object.defineProperty劫持data上各个属性上的setter和getter，当数据发生变化时，通知数据依赖的watcher订阅者，触发相应的监听回调

## vue的生命周期

### 每个生命周期的特点
``beforeCreate`` 数据观测和初始化事件都未开始，data、watcher和methods都还不存在
``created`` 实例创建之后被调用，该阶段可以访问到data，数据观测相关的东西都存在了，但dom还没有被挂载
``beforeMount`` dom挂载之前，相关的render函数在这之后首次被执行
``mounted`` 在挂载完dom之后被调用
``beforeDestroy`` 实例销毁前调用，实例仍然可用
``destroyed`` 实例销毁后调用，指令、监听事件、所有子实例都被销毁
``beforeUpdate`` dom更新之前
``updated`` dom更新之后
``activated`` 被keep-alive缓存的组件激活时调用
``deactivated`` 被keep-alive缓存的组件停用时调用

### 为什么会有生命周期
让我们可以控制vue实例不同阶段的过程
