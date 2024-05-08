# 编程题

[前端面试常见编程题汇总](https://zhuanlan.zhihu.com/p/620269113)

## 字节编程题：hook - 定时器问题

题目描述

```js
function Counter() {​
const [count, setCount] = useState(0);​

useEffect(() => {​
const id = setInterval(() => {​
setCount(count + 1);​
}, 1000);​
return () => clearInterval(id);​
}, []);​

return <h1>{count}</h1>;​
}​
```

### 1. count 输出是啥 ？ 为什么？ 如何修改？​

```js
function Counter() {​
const [count, setCount] = useState(0);​

useEffect(() => {​
const id = setInterval(() => {​
setCount(count + 1);​
}, 1000);​
return () => clearInterval(id);​
}, [count]);​

return <h1>{count}</h1>;​
}​
```

### 2. 如果有长任务卡顿，如何保证 count 输出正确

```js
useEffect(() => {
  const startTime = Date.now();
  setTimeout(() => {
    const curTime = Date.now();
    const x = Math.floor((curTime - startTime) / 1000);
    setCount(count + x);
  }, 2000);
}, []);
```

## 字节编程题：实现异步串行执行 （不使用 async）

题目描述

```js

var serial = (tasks) => {​
// do something​
return tasks.reduce((p, c) => {
return p.then((res) => {
return c().then((v) => {
res.push(v);
return res;
});
});
}, Promise.resolve([]));
}​

// 1 60ms 后输出 1​
// 2 (60+50)ms 后输出 2​
// 3​
// 4​
// 5​
// 6​
// done: [1,2,3,4,5,6] ​
serial(
    [
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 1); resolve(1) }, 60)),
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 2); resolve(2) }, 50)),
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 3); resolve(3) }, 40)),
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 4); resolve(4) }, 30)),
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 5); resolve(5) }, 20)),
        () => new Promise(resolve => setTimeout(() => { console.log(Date.now(), 6); resolve(6) }, 10))
    ]).then((results) => console.log('done: ', results))

```

## 立即执行函数赋值编程题

```js
var a = 111;
(function a() {
  console.log(a);
  a = 222;
  console.log(a);
})();
console.log(a);

// 输出结果：f f 111
```

## 如何让一个不可迭代对象，变成可迭代

```js
var obj = {
  0: 0,
  1: 1,
  length: 2,
};
for (i of obj) {
  console.log(i);
}
// 报错：Uncaught TypeError: obj is not iterable
```
