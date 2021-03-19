// 堆排序

function heapsort(arr) {
  function shiftdown(arr, i, len) {
    let left = 2 * i + 1, right = 2 * i + 2, largest = i
    if (left < len && arr[left] > arr[largest]) largest = left
    if (right < len && arr[right] > arr[largest]) largest = right
    if (largest != i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]]
      return shiftdown(arr, largest, len)
    }
  }
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    shiftdown(arr, i, arr.length)
  }
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]
    shiftdown(arr, 0, i)
  }
  return arr
}

console.log(heapsort([3, 4, 5, 6, 1, 7, 9, 8, 2]))
