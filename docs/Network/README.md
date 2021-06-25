
## trojan代理
https://tlanyan.me/trojan-tutorial/
https://www.youtube.com/watch?v=nUkh7CKqGb8

## tcp层相关知识

**三次握手 建立连接**  
第一步 客户端发送 SYN=1,seq=x 到服务器端 客户端进入SYN_SENT状态，等待服务器确认  
第二步 服务器端发送 SYN=1 ACK=1 seq=y ack=x+1 到客户端 服务器端进入SYN_RECV状态  
第三步 客户端发送 ACK=1 ack=y+1 seq=x+1 到服务器 双方进入ESTABLISHED状态  

**四次挥手 断开连接**  
第一步 客户端发送 FIN=1，seq=u 到服务器端 客户端进入FIN-WAIT1（终止等待状态1）  
第二步 服务器端发送 ACK=1，seq=v，ack=u+1 到客户端 服务器端进入CLOSE-WAIT 客户端进入FIN-WAIT2（终止等待状态2）  
第三步 由于处于半关闭状态，服务器端还有数据发向客户端 等服务器端发送完最后的报文后 发送FIN=1，ACK=1，ack=u+1，seq=w 到客户端 服务器进入LAST-ACK状态  
第四部 客户端发送ACK=1，seq=u+1，ack=w+1  客户端进入 TIME-WAIT 等待2MSL（最长报文段寿命）进入CLOSED状态 服务器端接收到消息后进入CLOSEED状态  

!>
为什么要等待2MSL？
 - 防止ACK包丢失，服务器重发FIN+ACK包
 - 确保包在网络中已失效

**TCP三次和四次握手详解**  
https://blog.csdn.net/qq_38950316/article/details/81087809  

**TCP的状态转换**  
https://baijiahao.baidu.com/s?id=1626222867928553865&wfr=spider&for=pc

## 状态码

- 200  请求成功  
- 201  请求成功并处理  
- 202  请求成功但没有处理  
- 204  请求成功但没有实体内容返回
- 206  请求了部分资源  
- 301  永久重定向（1.0标准，重定向时可变更请求方式）  
- 302  临时重定向（1.0标准，重定向时可变更请求方式）  
- 303  大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的，所以303基本用的很少，一般用302  
- 304  资源已找到，但未符合条件请求  
- 305  请求必须通过代理  
- 307  临时重定向 （1.1标准，重定向请求方式不可变）  
- 308  永久重定向 （1.1标准，重定向请求方式不可变）  
- 400  请求参数有误
- 401  请求需要验证用户身份
- 403  请求被理解但拒绝执行
- 404  请求失败，未找到合适资源
- 500  服务器未知错误
- 502  作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。
- 503  服务器维护或过载，当前无法处理请求
- 504  网关或代理服务器超时

!> [HTTP常用状态码详解](https://www.cnblogs.com/xixinhua/p/11013377.html)

## OSI模型
OSI model（open system interconnection reference model）

- 应用层 各种应用层协议，包括：http、websocket
- 表示层 信息的语法语义以及它们的关联，如加密解密、转换翻译、压缩解压等
- 会话层 不同机器上的用户之间建立及管理会话，如socket通信,socket是为了方便使用更底层协议(如tcp、udp)而存在的一种协议  
- `传输层` 接受上一层的数据，在必要的时候对数据进行分割并传递给网络层 如：tcp、udp
- 网络层 控制子网运行，如逻辑编码、分组传输、路由选择，包括：ip  
- 数据链路层 物理寻址，同时将原始比特流转变为逻辑传输线路，如以太网IEEE标准、ARP、RARP  
- 物理层 机械、电子、定时接口通信信道上的原始比特流传输

## websocket、http和tcp的区别
- websocket、http是应用层协议，tcp是传输层协议
- websocket、http都是基于tcp协议来传输数据
- websocket需先进行一次http协议握手，握手成功后，数据走tcp传输，与http无关了

https://www.cnblogs.com/merray/p/7918977.html  

## tcp和udp的区别
- tcp面向连接，通信前需要三次握手，udp不需要
- tcp传输可靠，有序，丢包重传，UPD不可靠
- tcp提供拥塞控制和流量控制机制；udp不提供
- tcp面向字节流传输，会把信息分割后重组，udp面向数据报，没有分组开销
- tcp更适合数据的完整性和准确性如文件传输、邮件等；udp更适合实时性要求比较高如视频通话、实时游戏等

## 短轮循、长轮循、SSE和Websocket

- `短轮循`每隔一段时间发送http请求到服务器，服务器不管有没数据更新都直接响应回去
- `长轮循`每隔一段时间发送http请求到服务器，服务器判断有数据更新就响应，没有则暂时挂起请求
- `SSE`利用html5新特性EventSource从服务器给客户端发送消息
- `websocket`在客户端和服务器实现真正的双向通信

!>
[WEB通讯技术](https://blog.csdn.net/myphp2012/article/details/78437462)  
[WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
[socket.io库](https://socket.io/)  

## http1.0、http1.1和http2.0的区别

- `http1.0`主要问题有`连接无法复用`(会导致每次请求都经历三次握手和慢启动)和`队头阻塞`(带宽无法被充分利用)
- `http1.1`主要区别
  - 1、`长连接` 默认开启connection:keep-alive，复用TCP的信息，但是会创建多个TCP连接，一般浏览器同域限制是6个
  - 2、`host域` 用于区分在一个物理服务器上存在多个虚拟主机共享一个IP地址
  - 3、`缓存处理` 在1.0的If-Modified-since、expires的缓存标志上，再新增etag、If-match等缓存策略
  - 4、`错误通知管理` 新增24个错误状态码
- `http2.0`主要区别
  - 1、`二进制格式` 以前的是文本格式
  - 2、`多路复用`   所有请求通过一个TCP连接并发完成，连接共享、优先级控制
  - 3、`header头部压缩` 降低带宽
  - 4、`服务器推送` 不需求客户端发请求，提前把客户端需要的js、css等文件给到客户端

!>
[HTTP/2 相比 1.0 有哪些重大改进？](https://www.zhihu.com/question/34074946)

## dns
Domain Name System 域名系统  
通过域名解析找到服务器对应的IP，域名便于用户记忆

### 欺骗手段

- 域名管理系统被黑
- 缓存感染，往DNS缓存服务器上放虚假信息
- DNS信息挟持，攻击者比DNS服务器更快的速度响应用户请求，或者是伪造大量的数据响应包淹没真实的响应数据
- DNS重定向挟持

### 防范手段

- 直接使用IP访问
- 尽量使用加密协议通信
- 足够的带宽，防止被洪流攻击

!?>
[DNS常见攻击与防范](https://www.williamlong.info/archives/3813.html)

## Protocol Buffer(简称 Protobuf)
 - PB协议是Google的一种数据交换的格式，是一种二进制格式，比XML数据交换更快。
 - 效率高、兼容性好
