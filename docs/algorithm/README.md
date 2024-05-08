[算法小抄](https://labuladong.gitbook.io/algo/)

## 中心扩展法求解子回文串数量

```js
const countSubstrings = (s) => {
  let count = 0;
  for (let i = 0; i < 2 * s.length - 1; i++) {
    let l = i / 2;
    let r = l + (i % 2);
    while (l >= 0 && r < s.length && s.charAt(l) == s.charAt(r)) {
      --l;
      ++r;
      ++count;
    }
  }
  return count;
};
```

## 尾递归优化

- 在递归调用时，把函数调用放在 return 的`最后执行`
- 上一个函数执行完不用保留直接出栈，能有效避免`调用栈溢出`

## 字典树

- 利用字符串的公共前缀来节约空间

```js
class Trie {
  constructor() {
    this.next = {};
    this.isEnd = false;
  }
  insert(str) {
    let curRoot = this;
    str.split("").forEach((elm) => {
      if (!curRoot.next[elm]) curRoot.next[elm] = new Trie();
      curRoot = curRoot.next[elm];
    });
    curRoot.isEnd = true;
  }
}
```

## 并查集

一种树型的数据结构，用于处理一些不相交集合的合并和查找问题

```js
class UnionFind {
  constructor(n) {
    this.parent = new Array(n).fill(0).map((el, index) => index);
    this.size = new Array(n).fill(1);
    this.setCount = n; // 当前连通分量数目
  }
  findset(x) {
    if (this.parent[x] === x) return x;
    // 把相连的多层变成一层的结构
    this.parent[x] = this.findset(this.parent[x]);
    return this.parent[x];
  }
  unite(a, b) {
    let x = this.findset(a);
    let y = this.findset(b);
    if (x === y) return false;
    if (this.size[x] < this.size[y]) [x, y] = [y, x];
    // 连起来
    this.parent[y] = x;
    this.size[x] += this.size[y];
    this.setCount -= 1;
    return true;
  }
  connected(a, b) {
    const x = this.findset(a);
    const y = this.findset(b);
    return x === y;
  }
}
```

## 洗牌算法

```js
// Math.random()：返回 [0,1) 之间的一个随机数
// 方法1
function sort1(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
// 方法2 正序遍历
function sort2(arr) {
  for (let i = 0; i < arr.length; i++) {
    let randomIndex = Math.floor(Math.random() * (arr.length - i) + i);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
// 方法3（推荐）倒序遍历
function sort3(arr) {
  for (let i = arr.length; i > 0; i--) {
    let index = Math.floor(Math.random() * i);
    [arr[index], arr[i - 1]] = [arr[i - 1], arr[index]];
  }
  return arr;
}
```

[384. 原地打乱数组](https://leetcode.cn/problems/shuffle-an-array/description/)

## 深拷贝

```js
function deepCopy(data) {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  const res = Array.isArray(data) ? [] : {};
  for (const i in data) {
    if (data.hasOwnProperty(i)) {
      res[i] = typeof data[i] === "object" ? deepCopy(data[i]) : data[i];
    }
  }
  return res;
}
```

## [异步求和](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/484)

```js
// 提供一个异步 add 方法如下，需要实现一个 await sum(...args) 函数：
function asyncAdd(a, b, callback) {
  setTimeout(() => {
    callback(null, a + b);
  }, 1000);
}
// 以下代码手动实现
function add(a, b) {
  return new Promise((resolve) => {
    asyncAdd(a, b, (_, s) => {
      resolve(s);
    });
  });
}

function sum(...args) {
  return args.reduce((p, x) => {
    return p.then((total) => {
      return add(x, total);
    });
  }, Promise.resolve(0));
}

// 优化版
function sum2(...args) {
  if (args.length === 1) return args[0];
  let result = [];
  for (let i = 0; i < args.length - 1; i += 2) {
    result.push(args[i], args[i + 1]);
  }
  if (args.length % 2) result.push(args[args.length - 1]);
  return sum2(...await Promise.all(result));
}

const result = await sum(1, 2, 3, 4);
console.log(result);
```

## [带并发限制的异步调度器，保证同时运行的任务最多只有两个](https://juejin.cn/post/7039917386589437989)

```js
// 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个。完善下面代码中的 Scheduler 类，使得以下程序能正确输出。
class Scheduler {
  constructor() {
    this.count = 2;
    this.queue = [];
    this.run = [];
  }
  add(promiseCreator) {
    // 以下代码手动实现
    this.queue.push(promiseCreator);
    return this.schedule();
  }
  schedule() {
    if (this.run.length < this.count && this.queue.length) {
      const task = this.queue.shift();
      const promise = task().then(() => {
        this.run.splice(this.run.indexOf(promise), 1);
      });
      this.run.push(promise);
      return promise;
    } else {
      return Promise.race(this.run).then(() => this.schedule());
    }
  }
}
const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
```

## 时针和分针的夹角

- 1 时 15 分：52.5 度
- 7 时 15 分：127.5 度

## [setTimeout 实现一个准时定时器](https://blog.csdn.net/yi_zongjishi/article/details/125915769)

```ts
function timer(fn, timeout) {
  fn();
  const startTime = Date.now();
  let count = 1;
  function cb() {
    fn();
    const ideal = timeout * count; // 理想状态
    const diff = Date.now() - startTime - ideal; // 误差
    count++;
    setTimeout(cb, timeout - diff);
  }
  setTimeout(cb, timeout);
}
function printDate() {
  console.log(new Date());
}
timer(printDate, 10000);
```
