# 二叉树

## 对称二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
  const dsf = (left, right) => {
    if (left && right) {
      return (
        left.val === right.val &&
        dsf(left.left, right.right) &&
        dsf(left.right, right.left)
      );
    }
    if (!left && !right) return true;
    return false;
  };
  return dsf(root, root);
};
```

## 平衡二叉树

```js
var isBalanced = function (root) {
  const dfs = (root) => {
    if (!root) return 0;
    const left = dfs(root.left);
    const right = dfs(root.right);
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  };
  return dfs(root) >= 0;
};
```

## 二叉树最大深度

```js
var maxDepth = function (root) {
  const dfs = (root) => {
    if (!root) return 0;
    return Math.max(dfs(root.left), dfs(root.right)) + 1;
  };
  return dfs(root);
};
```
