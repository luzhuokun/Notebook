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

## 前端性能优化
1. 减少http请求和报文大小
2. 设置http缓存、本地缓存和长连接
3. 优化代码（闭包要注意消耗对象和减少dom操作）

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

## 客户端渲染、服务器渲染（SSR）和预渲染（Prerendering）
- 在前后端分离的背景下，把渲染页面的工作放在前端中进行，如react、vue、angular等主流框架。
- 服务器渲染就是以前不分离的做法，把渲染页面的工作在后端进行，优势主要在于SEO和更快的内容显示，但是服务器渲染会加重服务器的负载，不过可以采用缓存策略降低负载。
- 预渲染则是在打包的时候打成多个HTML文件，如果你只是用来改善少数不经常改动的页面，则使用预渲染比服务器渲染更合适。[服务器端渲染 vs 预渲染](https://ssr.vuejs.org/zh/) [vue框架的预渲染实现问题](https://zhuanlan.zhihu.com/p/99318865)

## mvc和mvvm的区别
- mvc就是在controller中把model的数据赋值给view，view向controller发出动作指令，controller选择model驱动视图更新
- mvvm就是viewModel实现了数据的双向绑定，view和model不直接通信

## react和vue的比较
- react需要手动优化组件渲染
- JSX写法 template模版写法
- css作用域方面也是通过js来控制，vue中使用style scoped来控制
- 社区支持 官方支持
