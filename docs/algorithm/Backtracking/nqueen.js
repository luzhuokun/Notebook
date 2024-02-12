"use strict";

/** N皇后问题 */

//   0  1   2  3
// 0['','1','','']
// 1['','','','1']
// 2['1','','','']
// 3['','','1','']

const n = 4;
const q = []; // 记录列号
let sum = 0;

// 判断已经放好的前面的皇后位置
const isPlace = (x) => {
  for (let i = 0; i < x; i++) {
    if (q[i] === q[x] || Math.abs(i - x) === Math.abs(q[i] - q[x]))
      return false;
  }
  return true;
};

const loop = (x) => {
  if (x >= n) {
    console.log(q);
    return sum++;
  }
  // 遍历每列
  for (let y = 0; y < n; y++) {
    q[x] = y;
    if (isPlace(x)) loop(x + 1);
  }
};

loop(0);
