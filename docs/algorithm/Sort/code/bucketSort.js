// 桶排序
// 按照数据的最大和最小值划分成多个桶，并对每个桶内的数据进行排序，排序完成之后再按顺序整合到一起
// O(n+k) O(n+k) 1 稳定
function bucketSort(arr) {
  if (!arr.length) {
    return [];
  }
  let maxValue = arr[0];
  let minValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    minValue = Math.min(minValue, arr[i]);
    maxValue = Math.max(maxValue, arr[i]);
  }
  let bucketSize = 5;
  let buckets = Array.from({
    length: Math.floor((maxValue - minValue) / bucketSize) + 1,
  });
  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor((arr[i] - minValue) / bucketSize);
    buckets[index].push(arr[i]);
  }
  let ans = [];
  for (let i = 0; i < buckets.length; i++) {
    insertSort(buckets[i]);
    ans = ans.concat(buckets[i]);
  }
  return ans;
}

function insertSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j - 1] > arr[j]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      } else {
        break;
      }
    }
  }
  return arr;
}
