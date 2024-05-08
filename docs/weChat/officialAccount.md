## 支付

- 涉及三个角色：客户端、后台、微信支付平台
- 用户点击页面上的支付按钮
- 后台向微信支付系统发起`创单`请求，并把`订单号`等相关信息到我们的服务器上面去
- 用户拉起`微信收银台`，输入密码完成支付
- `微信支付系统`通知后台订单状态变更
  - 后台根据通知变更订单状态
  - 此时用户也会接收到推送通知，但 app 不能中无感
- 客户端点击完成按钮跳转到支付完成页，客户端请求后台接口`查询支付状态`，完成支付
- 由于网络原因，有可能后端没收到支付平台的通知，支付状态没有及时地改变，需要后台主动去调起微信支付系统的状态查询接口进行查询

?> [JSAPI 支付文档](https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter1_1_1.shtml)

## Oauth2.0

- Oauth2.0 就是一个`开放授权协议`，资源拥有者授权第三方（比如客户端、浏览器、服务器）访问资源服务器的资源
- Oauth2.0 有四种模式：`授权码模式`（最安全）、`密码模式`（会暴露用户的密码给第三方）、`客户端模式`（访问资源的权限都给第三方，权限可能太大）、`简化(隐式)模式`（应对没有服务器的情况，就不用返回授权码了）

## 公众号 Oauth2.0 认证流程

- Oauth 主要用来做第三方登录的， 公众号采用的认证方式是`授权码模式`
- 首先有户进入页面，调起用户的微信客户端进行`授权`
- 授权完成通过`重定向`把授权码（只用一次，5 分钟未使用就过期）带到后端
- 后端把授权码发送到公众号服务器，获取`access_token`、`openId`(2 小时有效) 和 `refresh_token`（刷新 access_token 时用的 token），在后台通过 access_token（不要暴露给客户端） 访问`用户信息`
- 后续实现自己的登录态，完成第三方登录

?>
有可能`access_token`会失效，失效可以通过`refresh_token`（30 天失效）进行刷新，如果 refresh_token 失效，则需要用户重新授权  
上面的[access_token](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)只对当前授权微信用户有效，与基础支持的[access_token](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html)不同
