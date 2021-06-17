## 一次完整的HTTP请求过程

域名DNS解析取目标IP -> TCP三次握手建立连接 -> 发送http请求 -> 解析http代码 ->请求http中的资源 ->浏览器渲染页面

## 浏览器渲染流程
parse html (生成dom和cssdom，合并成render tree) -> javascript -> style (Recalculate Style计算样式)-> layout (重排) -> paint（重渲染） -> composite (Composite Layers 合成图像)

![浏览器一帧的工作](https://aerotwist.com/static/blog/the-anatomy-of-a-frame/anatomy-of-a-frame.svg)

## html的加载执行流程
 先解析head标签内的信息 -> 解析meta信息 -> 并行加载link标签下的资源 -> 遇到script并行下载，但要等之前加载的link资源加载并解析完成 ->在body中遇到script会并行加载，解析的话要等加载完再一个接一个地解析并行下载的script，遇到img那些资源则不等待继续往下解析。

script放在head中时（不加async和defer）会阻塞后面body中的标签加载(测试发现所有的资源会并行的下载)
[一个完整html的加载执行过程](https://blog.csdn.net/csdn_girl/article/details/90520036)

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

### 为什么需要同源策略？
为了限制不同源之间的相互访问，如果没有同源策略，不同源之间的数据和资源可以随意相互访问的话，就失去了隐私和安全性了。

### 防御措施
- referer验证，referer就是告诉服务器这个请求是来源于哪个页面地址的
- token验证，在用户请求中带上提前随机生成的token给到服务器端验证
- 设置验证码，在用户操作的过程中设置身份确认的验证码操作，但会影响用户体验

?>
[XSS与CSRF区别](https://www.cnblogs.com/twlr/p/12287454.html)
[xss和csrf区别](https://www.cnblogs.com/itsuibi/p/10752868.html)

## 同源跨域
一个域下的js，在未经允许的情况下，不得读取另一个域的内容，但浏览器不会阻止你向另一个域发送请求。

### 前后端跨域通信
- JSONP
- CORS通信 （跨域资源共享）(是针对发出XMLHttpRequest请求的一个机制)
- websocket html5支持跨域通信的协议
- 设置代理 nginx
- iframe
  - postmessage（要等到嵌入的iframe页面加载完再进行通信）
  - 多层iframe嵌套（a.html嵌套b.html，b.html嵌套一个跟a域相同的页面，然后b域请求数据，后把数据带到这个页面上，然后这个页面上利用window.top预先存好的函数，然后把数据传进去执行）

?> [浏览器同源及其规避方法](https://www.cnblogs.com/TvvT-kevin/articles/12595350.html)

### 同源页面间的跨页面通信
- postmessage html5中实现跨源通信，要拿到另一个页面的window来发起postmessage，另一个页面才能接收到消息
- broadcastChannel，用于广播的通信频道，只要各个页面初始相同的频道标识就能相互通信
- serviceWorker，一个可以长期运行在后台的worker
- localstorage，当setItem发生变化时（要值真的改变）会触发storage监听事件
- window.open+window.opener

### 非同源页面间跨页面通信
-  iframe 与父页面间可以通过指定origin来忽略同源限制，以这个iframe页面做为"桥"嵌入到每个页面中去,交互的逻辑都在这个iframe里面

### iframe跨域请求
- iframe可以利用window.postmessage、messageChannel、broadcastChanel进行页面和iframe之间通信
- iframe同域时可以直接访问iframe.contentwindow.document.cookie（除了设置httponly），不同域则访问不到cookie
- 在跨域的情况下window.parent.postMessage是可以正常访问并调用的，window.parent也可以在子页面上调用，但是把window.parent打印出来就报错了,反之打印iframe.contentwindow也不行，postmessage则可以

### jsonp
利用script标签没有跨域限制的特性来实现跨域，用户把callback函数名称传递给服务器，服务器接收到请求并把callback和json数据一起传递给页面，页面接收并执行请求得到想要的数据。缺点就是不支持post

### CORS (cross-origin-resource sharing)跨域资源共享
?> 参考文献：[CORS详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

access-control-allow-origin: http://api.bob.com  
access-control-allow-credentials: true  
access-control-expose-headers: FooBar  

#### 简单请求和非简单请求

- 简单请求必须满足1、方法只能是head、get、post。2、头信息包括Accept、Accept-Language、Content-Language、Content-Type:只限于application/x-www-form-urlencoded、multipart/form-data、text/plain
- 非简单请求会先发出OPTIONS请求进行预检，满足跨域条件再发送实际请求

!>
那么怎么理解这些限制呢？

其实，简单请求就是普通 HTML Form 在不依赖脚本的情况下可以发出的请求，比如表单的 method 如果指定为 POST ，可以用 enctype 属性指定用什么方式对表单内容进行编码，合法的值就是前述这三种。

非简单请求就是普通 HTML Form 无法实现的请求。比如 PUT 方法、需要其他的内容编码方式、自定义头之类的。

[CORS 为什么要区分『简单请求』和『预检请求』？](https://blog.csdn.net/qihoo_tech/article/details/100681781)

#### 跨域请求后端接口时一般不会带上请求的那个域的cookie，需前后端配合才可以带
原生写法：
```js
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://xxxx.com/demo/b/index.php", true);
xhr.withCredentials = true; //支持跨域发送cookies
xhr.send();
```

jquery写法：
```js
$.ajax({
     type: "POST",
     url: "http://xxx.com/api/test",
     dataType: 'jsonp',
     xhrFields: {
          withCredentials: true
     },
     crossDomain: true,
     success:function(){},
     error:function(){}
});
```

## 浏览器缓存（http缓存）

- http1.0 `Pragma:no-cache`; http1.1 `Cache-Control:no-cache`
- http1.0 `Expires`; http1.1 `Cache-Control:max-age`=秒
- `Cache-Control`优先级高于`Expires`
- http1.0 `last-modified`资源最后修改时间，`if-modified-since`资源上次的`last-modified`时间; http1.1 `Etag` 校验值 在服务器内的唯一标识。
- `if-none-match` 当客户端资源过期，资源有`Etage`声明，则把`Etage`赋值给`if-none-match`一起传给服务器,服务器计算当前资源的新`Etag`与`if-none-match`进行比较，没变化返回304，有变化则返回200和资源
- `Cache-Control/Expires`优先级高于`Last-Modified/Etag`,即当当地副本根据`Cache-Control/Expires`发现还在有效期内，则不会再次发送请求去服务器询问修改时间`Last-Modified`或者实体标识符`Etag`
- `Etag`弥补`Last-Modified`只能精确到秒的缺陷
- `Etag`优先级高于`Last-Modified`
[浏览器缓存机制详解](https://blog.csdn.net/hhthwx/article/details/80152728)

### 强缓存和协商缓存
强缓存就是直接取客户端本地资源，不与服务器交互；协商缓存则需要与服务器交互再决定取客户端本地资源还是服务器资源

### memory cache 和 disk cache
由浏览器决定使用哪个cache,策略应该是根据内存使用率  
[浏览器是根据什么决定「from disk cache」与「from memory cache」](https://www.zhihu.com/question/64201378?sort=created)

## 浏览器客户端本地缓存
- Cookie
- LocalStorge
- SessionStorge

### Cookie
信息存储到客户端本地中，用于客户端和服务器端的交互，常用于存储用户状态信息  
[Cookie的所有属性详解](https://blog.csdn.net/qq_39834073/article/details/107808959)

#### name和value
一个键值对，一旦创建name就不能改，name区分大小写

#### Domain
决定在向该域发起请求时带上cookie，该设置对子域有效。Domain参数必须以点(".")开始。

#### Expires/Max-Age
两者都是cookie的有效期，Expires指cookie被删的时间戳，Max-Age指有效时间，单位为秒，Max-Age为0则立即失效。两者都不传的话默认为`session`值，这个session值指的是跟随服务器上的session设置的过期时间

#### HttpOnly
- 当httponly属性设置为true让js无法获取当前的cookie信息,能有效地防止xss攻击。
- 不允许通过脚本document.cookie去更改这个值，同样这个值在document.cookie中也不可见，但在`发送请求时依旧会携带此Cookie`。

#### SameSite
用来防止 CSRF 攻击和用户追踪  
可设值：  
- Strict
- Lax
- None

### sessionStorage和localStorage
- localStorage只适用于同源页面上
- localStorage则是永久保存到客户端的硬盘上，需手动清除
- sessionStorage就是从标签页打开到标签页关闭的这段时间里面有效，即当前会话有效
- sessionStorge适合在打开一个标签页后，用户浏览一组页面期间使用，关闭窗口后数据就可以丢弃了
- 两者大小一般都是5M
- 对数据的操作有相应的API接口，不需要像cookie要自己封装setCookie和getCookie

解决以下问题：  
- 大小：cookie被限制为4K
- 带宽：cookie会随着请求一起发送
- 易用性

## 浏览器渲染帧

1000/60≈16.666667ms   
每一帧：Input events`用户交互` ->js`js解析执行` -> rAF`requestAnimationFrame调用上一次收集的callback回调` -> Layout`布局` -> Paint`绘制` ->Composite`合成各层渲染结果`

[16ms渲染帧](https://www.cnblogs.com/liuhao-web/p/8266872.html)

## requestIdleCallback和requestAnimationFrame

- `requestAnimationFrame` 在页面重绘重排前执行
- `requestIdleCallback` 渲染完成后，浏览器有空闲时执行，有可能浏览器一直忙碌而导致该方法很晚才执行，所有可以设置timeout超时时间执行，尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行

[requestIdleCallback和requestAnimationFrame详解](https://www.jianshu.com/p/2771cb695c81)

## SourceMap

- sourceMap文件存储着压缩代码前每一行的位置信息
- sourceMap就是解决对`压缩`、`合并`后的代码，debug调试时能找到对应的报错位置
- Chrome谷歌浏览器根据这个sourceMap重现压缩前的代码
- 启动sourceMap则是代码尾部补上一个注释 `//# sourceMappingURL=map文件地址`
!> `VLQ码`非常精简地表示很大的数值, 算法大概就是把字母变成二进制，然后借用base64的码表进行转码

[JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

## 进程和线程
- 进程是资源分配的基本单位
- 线程是资源调度的基本单位

## scheme协议
通过scheme协议，以页面跳转的方式打开本地app应用
