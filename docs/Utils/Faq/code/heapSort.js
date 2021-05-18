// 堆排序

function heapsort(arr) {
  function shiftdown(arr, left, right) {
    const i = 2 * left + 1
    const j = 2 * left + 2
    let largest = left
    if (i < right && arr[i] > arr[largest])largest = i
    if (j < right && arr[j] > arr[largest])largest = j
    if (largest !== left) {
      [arr[largest], arr[left]] = [arr[left], arr[largest]]
      shiftdown(arr, largest, right)
    }
  }
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    shiftdown(arr, i, arr.length)
  }
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]]
    shiftdown(arr, 0, i)
  }
  return arr
}

console.log(heapsort([3, 4, 5, 6, 1, 7, 9, 8, 2]))
