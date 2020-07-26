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
