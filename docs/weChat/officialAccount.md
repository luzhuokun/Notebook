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

## oauth2.0

资源拥有者给第三方应用授权访问资源服务器的资源信息

- 首先用户进入页面时，把用户重定向到`授权地址`
- 用户同意授权，把临时`code`通过重定向的方式带到后台去，`redirect_uri`带上用户的授权 code（用一次，5 分钟未使用就过期）
- 然后在后台中，通过用户的授权码，向微信公众号服务器发送请求获取`access_token`和`openid`(2 小时有效)，以及一个`refresh_token`（刷新 access_token 用的 token）
- 通过`access_token`和`openid`获取用户信息并完成登录态
- 最后再通过重定向的方式把登录态保持到浏览器本地

?>
有可能`access_token`会失效，失效可以通过`refresh_token`（30 天失效）进行刷新，如果 refresh_token 失效，则需要用户重新授权  
上面的[access_token](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)只对当前授权微信用户有效，与基础支持的[access_token](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html)不同
