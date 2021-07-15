
## 支付
- 用户`下单`，我们的后台向微信支付系统发起创建订单请求，并把订单号保存到我们的服务器上面去
- 用户发起`支付`，调起收银台，然后输入密码确认支付
- 微信客户端向微信支付系统提交`授权`，然后支付系统通知我们的后端
- 后端`异步`收到微信服务器`响应`的订单支付的结果并保存起来并告知支付系统成功接收通知
- 然后支付系统再`通知`微信客户端
- 客户端请求我们的后台去`查支付状态`
- `如果状态没刷新`就主动去向我们服务器请求支付状态查询，我们再去调支付系统的接口进行查询
- 最后就把支付消息显示到前端去

https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter1_1_1.shtml

## oauth2.0
授权第三方应用去获取用户信息
- 首先访问我们的页面，然后把用户重定向到`授权地址`
- 用户同意授权，获取`code`，跳转我们带过去的重定向地址`redirect_uri`带上用户的授权code（用一次，5分钟未使用就过期）
- 随后在后台中利用用户的授权code，然后拿着这个code向微信公众号服务器`access_token`和`openid`(2小时有效)
- 通过access_token和openid获取用户信息
- 后续做自己系统内部的业务信息

https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
