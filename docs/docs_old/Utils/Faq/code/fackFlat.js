// 模拟实现flat拉平数组
function fackFlat(arr, num = Infinity) {
  if (num < 1) return arr;
  let res = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res = res.concat(fackFlat(item, num - 1));
    } else {
      res.push(item);
    }
  });
  return res;
}

fackFlat([1, [3, [4, 7]], , , [5, 6]]);
