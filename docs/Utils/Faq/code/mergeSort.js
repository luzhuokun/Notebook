// 归并排序

let mergeSort = (arr, left, right) => {
  if (left < right) {
    const mid = left + (right - left>>1)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    // 合并
    let i = left
    let j = mid + 1
    const temp = []
    while (i <= mid && j <= right) {
      if (arr[i] < arr[j]) {
        temp.push(arr[i++])
      } else {
        temp.push(arr[j++])
      }
    }
    while (i <= mid) {
      temp.push(arr[i++])
    }
    while (j <= right) {
      temp.push(arr[j++])
    }
    temp.forEach((x) => { arr[left++] = x })
  }
}

let arr = [4, 5, 3, 6, 1, 2]
mergeSort(arr, 0, arr.length - 1)
console.log(arr)
