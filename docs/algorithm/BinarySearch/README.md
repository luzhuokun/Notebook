# 二分查找

时间复杂度：O(logn)
比较一次，去掉一半不符合的数据

## 返回目标值相等的索引

```js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return -1;
}
```

## 返回第一次出现目标值的索引、第一个大于目标值的索引

```js
function binarySearchFirst(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] >= target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

## 返回最后一次出现目标值的索引

```js
function binarySearchLast(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return right;
}
```

## 875.爱吃香蕉的珂珂

```js
var minEatingSpeed = function (piles, H) {
  let max = Math.max.apply(null, piles);
  let min = 1;
  let k = 0;
  while (min < max) {
    k = Math.floor((max + min) / 2);
    let h = 0; // 在k速度下要吃多少小时
    for (let j = 0; j < piles.length; j++) {
      h += Math.ceil(piles[j] / k);
    }
    // 符合要求
    if (h <= H) {
      max = k; // 再去找更小速度中有没符合要求的
    } else {
      min = k + 1;
    }
  }
  return k;
};
```
