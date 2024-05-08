// 插入排序
// 把值插入到已经排好序的数组中
// O(n^2) 1 稳定

let insertSort = (arr) => {
  let l = arr.length;
  for (let i = 0; i < l; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      } else {
        break;
      }
    }
  }
  return arr;
};

console.log(insertSort([4, 5, 3, 6, 1, 2]));
