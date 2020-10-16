# polyfill自己实现某些功能

## 函数组合
```js
const compose = (...fns) => fns.reduceRight((before, after) => (...args) => after.call(null, before.apply(null, args)), fns.pop())
```

## 柯里化函数
```js
const curry = (fn) => {
  const len = fn.length
  return function cb(...args) {
    if (args.length >= len) {
      return fn.apply(null, args)
    } else {
      return (...args2) => {
        return cb.apply(null, args.concat(args2))
      }
    }
  }
}
```

## 简易版promise
```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
const MyPromise = function (fn) {
    var that = this;
    that.state = PENDING;
    that.value = null;
    that.onResolveCallbacks = [];
    that.onRejectCallbacks = [];
    function resolve(value) {
        if (that.state === PENDING) {
            that.state = RESOLVED
            that.value = value
            that.onResolveCallbacks.map(function (fn) {
                return fn(value)
            })
        }
    }
    function reject(value) {
        if (that.state === PENDING) {
            that.state = REJECTED
            that.value = value
            that.onRejectCallbacks.map(function (fn) {
                throw value
            })
        }
    }
    that.then = function (resolved, rejected) {
        that.onResolveCallbacks.push(resolved)
        that.onRejectCallbacks.push(rejected)
        return that
    }
    try {
        fn(resolve, reject)
    } catch (e) {
        reject(e)
    }
}
```

[一步一步实现一个完整的promise](https://github.com/xieranmaya/blog/issues/3)
