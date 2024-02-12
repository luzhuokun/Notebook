// 计数排序
// 输入的数据在一定确定范围内的整数
// O(n+k) O(k) 稳定
function countingSort(arr) {
  let bucket = [];
  let ans = [];
  for (let i = 0; i < arr.length; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }
  for (let i = 0; i < bucket.length; i++) {
    const count = bucket[i] || 0;
    for (let j = 0; j < count; j++) {
      ans.push(i);
    }
  }
  return ans;
}
