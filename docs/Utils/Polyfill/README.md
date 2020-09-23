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
