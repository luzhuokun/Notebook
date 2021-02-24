// 归并排序

let mergeSort = (arr, left, right) => {
  if (left < right) {
    let mid = Math.floor(left + (right - left) / 2)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    // 合并
    let i = left
    let j = mid + 1
    let temp = []
    while (i <= mid && j <= right) {
      if (arr[i] < arr[j]) {
        temp.push(arr[i])
        i++
      } else {
        temp.push(arr[j])
        j++
      }
    }
    while (i <= mid) {
      temp.push(arr[i])
      i++
    }
    while (j <= right) {
      temp.push(arr[j])
      j++
    }
    temp.forEach(x => arr[left++] = x)
  }
}

let arr = [4, 5, 3, 6, 1, 2]
mergeSort(arr, 0, arr.length - 1)
console.log(arr)
