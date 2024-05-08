// 基数排序
// 根据每个元素上的每位数字的值来分配桶
// O(n*k) O(n+k) 稳定
function radixSort(arr) {
  if (!arr.length) {
    return [];
  }
  let maxValue = arr[0];
  arr.forEach((element) => {
    maxValue = Math.max(maxValue, element);
  });
  let len = ("" + maxValue).length;
  let buckets = [];
  let mod = 10;
  let dev = 1;
  for (let i = 0; i < len; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < arr.length; j++) {
      let index = Math.floor((arr[j] % mod) / dev);
      if (!buckets[index]) {
        buckets[index] = [];
      }
      buckets[index].push(arr[j]);
    }
    arr.length = 0;
    for (let j = 0; j < buckets.length; j++) {
      while (buckets[j] && buckets[j].length) {
        arr.push(buckets[j].shift());
      }
    }
  }
  return arr;
}

console.log(radixSort([3, 2, 1, 4, 6, 5]));
