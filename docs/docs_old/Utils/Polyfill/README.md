polyfill 用来支持旧浏览器不支持的新特性，这里主要记录一下自己实现某些特性的思路和方案。

## 柯里化函数

把接收多个参数的函数变成接收单一或者部分参数的函数，并在多次传参和调用中返回最终结果
应用场景：可以分步执行函数的逻辑，先保存部分参数；优化函数执行的流程

```js
function curry(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  } else {
    return curry.bind(null, fn, ...args);
  }
}
const add = curry((a, b) => a + b);
console.log(add(1)(2));
```

## 函数组合

把多个函数组组合成一个按照一定顺序去执行（默认从右往左）的函数，前一个执行的结果传入下一个函数去。

```js
function compose(...fns) {
  return (value) => {
    return fns.reduceRight((result, fn) => {
      return fn(result);
    }, value);
  };
}
compose(
  (x) => {
    try {
      return x + 1;
    } finally {
      console.log(x);
    }
  },
  (x) => {
    try {
      return x + 2;
    } finally {
      console.log(x);
    }
  }
)(1);
```

## 手写[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

- 三个状态（等待中、已兑现、已拒绝）
- resolve、reject 通过宏任务模拟微任务实现
- 在执行 resolve/reject 时会把 then 入参的回调放入微任务队列中等待执行
- then 每次执行会产生新的 Promise，新的 Promise 会等待上一次 Promise 执行完并状态改变后才执行

```js
const PENDING = "pending"; // 等待中
const RESOLVED = "resolved"; // 已兑现
const REJECTED = "rejected"; // 已拒绝
class MyPromise {
  constructor(fn) {
    const self = this;
    this._status = PENDING; // 状态
    this._value = null; // resolve或reject传入的值
    this._onResolvedCallbacks = []; // 已兑现队列
    this._onRejectedCallbacks = []; // 已拒绝队列
    function resolve(value) {
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
      } else {
        // mock
        setTimeout(() => {
          if (this._status === PENDING) {
            this._status = RESOLVED;
            this._value = value;
            this._onResolvedCallbacks.forEach((fn) => fn(value));
          }
        }, 0);
      }
    }
    function reject(value) {
      // mock
      setTimeout(() => {
        if (this._status === PENDING) {
          this._status = REJECTED;
          this._value = value;
          this._onRejectedCallbacks.forEach((fn) => fn(value));
        }
      }, 0);
    }
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(resolved, rejected) {
    const self = this;
    return new MyPromise((resolve, reject) => {
      function onResolved() {
        try {
          const result = resolved(self._value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      }
      function onRejected() {
        try {
          const result = rejected(self._value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            reject(result);
          }
        } catch (error) {
          reject(error);
        }
      }
      switch (this._status) {
        case PENDING:
          this._onResolvedCallbacks.push(onResolved);
          this._onRejectedCallbacks.push(onRejected);
          break;
        case RESOLVED:
          onResolved();
          break;
        case REJECTED:
          onRejected();
          break;
      }
    });
  }
}
```

## 洋葱模型

```js
function compose(middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError("must be array!");
  for (let mw of middlewares)
    if (typeof mw !== "function") throw new TypeError("must be function!");
  return function (context, next) {
    let index = -1; // 防止next被调用两次
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return dispatch(0);
  };
}
const middlewares = [];
const use = (mw) => {
  middlewares.push(mw);
};
// test
const run = compose(middlewares);
const ctx = {};
const wm1 = async (context, next) => {
  console.log("wm1 前");
  await next();
  console.log("wm1 后");
};
const wm2 = async (context, next) => {
  console.log("wm2 前");
  await next();
  console.log("wm2 后");
};
use(wm1);
use(wm2);
run(ctx, () => {
  console.log("test");
});
```
