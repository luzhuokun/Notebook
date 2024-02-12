// 选择排序
// 选择最小/最大的值放到序列的起始位置
// O(n^2) 1 不稳定

let selectSort = (arr) => {
  let l = arr.length;
  for (let i = 0; i < l - 1; i++) {
    let minindex = i;
    for (let j = i + 1; j < l; j++) {
      if (arr[minindex] > arr[j]) minindex = j;
    }
    [arr[i], arr[minindex]] = [arr[minindex], arr[i]];
  }
  return arr;
};

console.log(selectSort([4, 5, 3, 6, 1, 2]));
