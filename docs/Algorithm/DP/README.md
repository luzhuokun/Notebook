
# 动态规划

- 将原问题转发为子问题
- 确定状态
- 确定边界
- 确定状态转移方程

特点
- 重叠子问题
- 最优子结构

# 斐波那契
![fibonacci](./fibonacci.ipg)

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
华为面试变种题：增加一个不能连续跳两次的条件
推导出f(n) = f(n-1)+f(n-3)
