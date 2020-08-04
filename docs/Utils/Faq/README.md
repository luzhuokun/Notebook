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
