
# 动态规划

- 将原问题转发为子问题
- 确定状态
- 确定边界
- 确定状态转移方程

特点：问题具有最优子结构、无后效性

## 爬楼梯
```js
var climbStairs = function (n) {
  var dp = [0,0,1]
  for(var i =1;i<=n;i++){
    dp[0]=dp[1]
    dp[1]=dp[2]
    dp[2]=dp[0]+dp[1]
  }
  return dp[2]
}
```
