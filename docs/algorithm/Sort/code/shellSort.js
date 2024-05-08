// 希尔排序（最小增量排序算法）
// 插入排序的升级版 把数据按步长gap分组，对每组数据进行直接插入排序；步长gap不断减少，直至等于1
// On^1.3-2 1 不稳定
function shellSort(arr) {
  let gap = Math.floor(arr.length / 2);
  while (gap) {
    for (let i = gap; i < arr.length; i++) {
      let j = i;
      let current = arr[i];
      while (j - gap >= 0 && current < arr[j - gap]) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = current;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}

console.log(shellSort([4, 5, 3, 6, 1, 2]));
