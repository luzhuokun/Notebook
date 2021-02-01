[算法小抄](https://labuladong.gitbook.io/algo/)

## 中心扩展法求解子回文串数量
```js
const countSubstrings = (s) => {
    let count = 0
    for (let i = 0; i < 2 * s.length - 1; i++) {
        let l = i / 2
        let r = l + i % 2
        while (l >= 0 && r < s.length && s.charAt(l) == s.charAt(r)) {
            --l;
            ++r;
            ++count;
        }
    }
    return count
}
```

## 尾递归
在递归调用时，在整个函数的最后执行并且不在一个表达式内
