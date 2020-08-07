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
传输层 tcp  
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
