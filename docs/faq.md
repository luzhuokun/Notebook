
### 数组内元素逐一执行同一个异步函数
```js
const arr = [1, 2, 3, 4];
const yibu = (x) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(x + 1)
    }, 1);
});
let p = Promise.resolve(0);
const res = [];
arr.forEach((value) => {
    p = p.then((r) => {
        res.push(r);
        return yibu(value);
    })
});
p.then((r) => {
    res.shift();
    res.push(r);
    console.log(res);
});
```

