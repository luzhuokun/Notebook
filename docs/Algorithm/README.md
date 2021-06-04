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

## 字典树
```js
class Trie {
  constructor() {
    this.next = {}
    this.isEnd = false
  }
  insert(str) {
    let curRoot = this
    str.split('').forEach((elm) => {
      if (!curRoot.next[elm]) curRoot.next[elm] = new Trie()
      curRoot = curRoot.next[elm]
    })
    curRoot.isEnd = true
  }
}
```

## 并查集
  一种树型的数据结构，用于处理一些不相交集合的合并和查找问题
```js
class UnionFind {
    constructor(n) {
        this.parent = new Array(n).fill(0).map((el, index) => index)
        this.size = new Array(n).fill(1)
        this.setCount = n // 当前连通分量数目
    }
    findset(x) {
        if (this.parent[x] === x) return x
        // 把相连的多层变成一层的结构
        this.parent[x] = this.findset(this.parent[x])
        return this.parent[x]
    }
    unite(a, b) {
        let x = this.findset(a)
        let y = this.findset(b)
        if (x === y) return false
        if (this.size[x] < this.size[y]) [x, y] = [y, x]
        // 连起来
        this.parent[y] = x
        this.size[x] += this.size[y]
        this.setCount -= 1
        return true
    }
    connected(a, b) {
        const x = this.findset(a)
        const y = this.findset(b)
        return x === y
    }
}
```

## 洗牌算法
```js
function sort1(arr) {
  return arr.sort(() => Math.random - 0.5)
}
function sort2(arr) {
  let len = arr.length;
  for (let i = len; i > 1; i--) {
    let index = Math.floor(Math.random() * i);
    [arr[index], arr[i - 1]] = [arr[i - 1], arr[index]];
  }
  return arr;
}
```
