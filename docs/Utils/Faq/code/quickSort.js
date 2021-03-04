// 快速排序

let quickSort = (arr, left, right) => {
  if (left < right) {
    let i = left
    let j = right
    let v = arr[i]
    while (i < j) {
      // 把右边小的放基准左边
      while (i < j && arr[j] >= v) j--
      arr[i] = arr[j]
      // 把左边大的放基准右边
      while (i < j && arr[i] <= v) i++
      arr[j] = arr[i]
    }
    arr[i] = v
    let index = i
    quickSort(arr, left, index - 1)
    quickSort(arr, index + 1, right)
  }
}

let arr = [4, 5, 3, 6, 1, 2]
quickSort(arr, 0, arr.length - 1)
console.log(arr)
