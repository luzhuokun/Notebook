// 堆排序（nlog2n 1 不稳定）
// 特点：该二叉树保持父节点总是比子节点大（或小）
// 完全二叉树特点：
// 任何一层节点的最左子节点序号：2n + 1 右子节点序号：2n + 2
// 最后一个非叶子节点的序号：n/2 - 1

function heapSort(arr) {
  function shiftDown(arr, left, right) {
    const i = 2 * left + 1;
    const j = 2 * left + 2;
    let largest = left;
    if (i <= right && arr[i] > arr[largest]) largest = i;
    if (j <= right && arr[j] > arr[largest]) largest = j;
    if (largest !== left) {
      [arr[largest], arr[left]] = [arr[left], arr[largest]];
      // 这里继续递归交换是为了保证当前节点是该树下的最值
      shiftDown(arr, largest, right); // 这里要注意一下right值，即最后一个节点的边界问题
    }
  }
  const len = arr.length;
  // 从最下层最左的节点开始,两两节点和父节点比较，最大的放父节点，最后把最大值置换到根部0号位
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    shiftDown(arr, i, len - 1);
  }
  // 跟最后一位互换，然后对剩余的节点做递归比较置换
  for (let i = len - 1; i > 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]];
    shiftDown(arr, 0, i - 1);
  }
  return arr;
}

console.log(heapSort([3, 4, 5, 6, 1, 7, 9, 8, 2]));
