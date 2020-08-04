
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

**TCP三次和四次握手详解**  
https://blog.csdn.net/qq_38950316/article/details/81087809  

**TCP的状态转换**  
https://baijiahao.baidu.com/s?id=1626222867928553865&wfr=spider&for=pc

## 状态码

200  请求成功  
201  请求成功并处理  
202  请求成功但没有处理  
204  请求成功但没有任何资源返回客户端  
206  请求了部分资源  
301  永久重定向（1.0标准，重定向时可变更请求方式）  
302  临时重定向（1.0标准，重定向时可变更请求方式）  
303  大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的，所以303基本用的很少，一般用302  
304  资源已找到，但未符合条件请求  
305  请求必须通过代理  
307  临时重定向 （1.1标准，重定向请求方式不可变）  
308  永久重定向 （1.1标准，重定向请求方式不可变）  
