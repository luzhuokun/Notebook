# 二分查找

比较一次，把不符合要求的一半去掉

## 875.爱吃香蕉的珂珂
```js
var minEatingSpeed = function(piles, H) {
    let max = Math.max.apply(null, piles)
    let min = 1
    let k = 0
    while (min < max) {
        k = Math.floor((max + min) / 2)
        let h = 0 // 在k速度下要吃多少小时
        for (let j = 0; j < piles.length; j++) {
            h += Math.ceil(piles[j] / k)
        }
        // 符合要求
        if (h <= H) {
            max = k // 再去找更小速度中有没符合要求的
        } else {
            min = k + 1
        }
    }
    return k
};
```
