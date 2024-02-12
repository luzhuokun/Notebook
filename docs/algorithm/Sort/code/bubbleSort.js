// 冒泡排序
// O(n^2) 1 稳定

let bubbleSort = (arr) => {
  let l = arr.length - 1;
  for (let i = 0; i < l; i++) {
    let isValid = true;
    for (let j = 0; j < l - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        isValid = false;
      }
    }
    if (isValid) return arr;
  }
  return arr;
};

console.log(bubbleSort([4, 5, 3, 6, 1, 2]));
