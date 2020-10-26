## 浏览器渲染流程
parse html (生成dom和cssdom，合并成render tree) -> javascript -> style (Recalculate Style计算样式)-> layout (重排) -> paint（重渲染） -> composite (Composite Layers 合成图像)

## Memory分析内容泄露

- Heap snapshot - 用以打印堆快照，堆快照文件显示页面的 javascript 对象和相关 DOM 节点之间的内存分配
- Allocation instrumentation on timeline - 在时间轴上记录内存信息，随着时间变化记录内存信息。
- Allocation sampling - 内存信息采样，使用采样的方法记录内存分配。此配置文件类型具有最小的性能开销，可用于长时间运行的操作。它提供了由 javascript 执行堆栈细分的良好近似值分配。

?> https://www.cnblogs.com/ys-ys/p/11336811.html

## JavaScript引擎
- JavaScriptCore（safari、WebKit的默认JavaScript引擎、iOS及ios内小程序）
- v8（Google、Android浏览器）
- Carakan（Opera）
- SpiderMonkey/TraceMonkey/JagerMonkey(对应Mozilla Firefox 1.0~3.0、3.5~3.6、4.0以上)
- Chakra（微软IE9.0以上）
- JScript（IE3.0~IE8.0）
- JSCore （Android小程序）
- nwjs（IDE微信开发工具，由 Chrome Webview 来渲染）
?>
[常见的JavaScript引擎](https://leowang721.github.io/2017/03/21/js/javascript-engine/)
[javascriptCore全面解析](https://www.cnblogs.com/qcloud1001/p/10305293.html)

## 渲染引擎
- webkit（Chrome、safari、opera、IOS小程序）
- trident（IE、edge）
- gecko(Mozilla Firefox 是基于 Gecko 开发)
- blink（2013年4月，谷歌利用 WebKit 渲染引擎开发自主的网页渲染引擎Blink，同时Opera也跟随Google的步伐）
- X5（微信、QQ浏览器基于webkit的增强内核、Android小程序）

## xss攻击
cross site script 跨域脚本攻击  
攻击者在页面上嵌入恶意的script脚本，获取或改造用户的私有信息  

### 分类
- 反射型
- 存储型
- dom型

### 防御措施
- 设置黑名单和白名单
- 对用户输入进行过滤
- 入参字符过滤
- 出参字符转义
- cookie设置httponly

## csrf攻击
cross site request forgery 跨域请求伪造  
攻击者盗用用户的身份执行这个用户权限下的操作  
在同源策略(同源是指协议、端口、域名相同)下，伪造的B网站只能伪造用户发起请求，但拿不到cookie

### 防御措施
- referer验证，referer就是告诉服务器这个请求是来源于哪个页面地址的
- token验证，在用户请求中带上提前随机生成的token给到服务器端验证
- 设置验证码，在用户操作的过程中设置身份确认的验证码操作，但会影响用户体验

## cookie
信息存储到客户端本地中，用于客户端和服务器端的交互，常用于存储session信息

### httponly
当httponly属性设置为true让js无法获取当前的cookie信息,能有效地防止xss攻击

?>
[XSS与CSRF区别](https://www.cnblogs.com/twlr/p/12287454.html)
[xss和csrf区别](https://www.cnblogs.com/itsuibi/p/10752868.html)

## 同源跨域
一个域下的js，在未经允许的情况下，不得读取另一个域的内容，但浏览器不会阻止你向另一个域发送请求。

- JSONP
- CORS （跨域资源共享）(是针对发出XMLHttpRequest请求的一个机制)
- websocket
- postmessage
- 设置代理

?> [浏览器同源及其规避方法](https://www.cnblogs.com/TvvT-kevin/articles/12595350.html)


