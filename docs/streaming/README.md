## HLS

- HTTP Live Streaming 基于 HTTP 的流媒体网络传输协议
- 原理
  - `索引m3u8文件`
    - 二级索引文件
      - 用于切换不同分辨率
  - `ts 片段`
- 特点
  - 直播没什么优势（延时 5s-30s），优化后 3 秒左右，点播优势明显
  - 苹果设备原生支持
- 优化方案
  - L-HLS 社区版
    - 一般情况下，一个视频片段要下载好才能开始播
    - 优化策略：把一个 3 秒的分片分成更小的分片进行传输，降低起播延迟
  - LL-HLS 苹果官方版
    - 原本利用 http2.0 的服务器推送特性，但很多 CDN 不支持，然后做了妥协增加一些字段来支持
  - [3 秒左右的低延迟直播方案 - L-HLS 和 LL-HLS](https://juejin.cn/post/7012155300916658189)

## WebRTC

- Web Real-Time Communication 网页即时通信，是一个实现 p2p 端到端音视频通信的框架
- 核心
  - WebRTC C C++ API (PeerConnection): 这层的 API 相对比较少，最主要就是实现 P2P 连接
  - Session Management
  - 音频引擎、视频引擎、传输（UDP）
- 特点
  - 低延迟（1s 以内，可以优化到 100ms-200ms），其他基本都是秒级延迟
  - 流量少
  - 性能好
- 浏览器用到的 api
  - RTCPeerConnection
- webRTC 工作流程
  - 本地`采集`
    - 添加媒体`轨道`（音频、视频）到对等对象上，获取摄像头/麦克风权限（通过 getUserMedia 获取）
    - 通过 rtcConnection.addEventListener('track',()=>{})捕获远程的轨道
  - 创建`RTCPeerConnection`对象
  - 通过`信令服务器`交换双方信息并`建立连接`，交换 SDP（会话描述信息）、ICE（候选信息）
    - SDP 和 ICE 信息通过信令服务器交换
    - 通过信令服务器建立 P2P 连接
    - `SDP`（Session Description Protocol 会话描述协议）
      - 交换会话信息
      - 交换支持的编码、传输协议等
    - `ICE`（Interactive Connectivity Establishment，即交互式连接建立）
      - 确定双方直连的 IP 和端口
      - NAT 穿透（两个不同网络下的内网主机连接，通过 NAT 技术找到外网映射的 ip 和端口完成连接）
      - 收集本地地址，配合 `STUN/TURN` 确定最优传输路径
      - STUN 服务收集 NAT 外网地址
      - TURN 收集中继地址
  - 最后通过`建立数据通道`（data channel）传递媒体流（MediaStream）

### 为什么 webRTC 延时低

- 基于 UDP、RTP 协议

[浅聊 WebRTC 视频通话](https://juejin.cn/post/7000205126719766565)  
[WebRTC Internals 工具在项目中的实践](https://juejin.cn/post/7022909301035368456)  
[WebRTC 开发实践：从一对一通话到多人会议](https://blog.51cto.com/ticktick/2348008)

## RTMP

- Real-Time Messaging Protocol 实时消息协议
- 特点
  - 需要用到 flash 播放器
  - 延时 1-3s

## HTTP-FLV

- Http Flash Video
- 特点
  - RTMP 的 HTTP 版本，都需要封装成 FLV 格式进行传输，引入 flv.js 开源库（B 站开源）
  - 延时 1-3s
- 工作流程
  - obs 软件进行录屏，对视频进行 h264 编码，对音频进行 acc 编码，对编码后的数据进行封包，通过 FMTP 协议传输到我们的服务器上面去处理生成 flv 格式的流媒体文件，用户通过拉流请求到浏览器上面去，然后通过 flv.js 对 flv 格式的视频进行实时地解析转成 mp4 文件然后丢给 video 标签进行播放。

## WebRTC、HLS、RTMP、HTTP-FLV 的区别

- `webRTC` 是`目前最流行`的音视频传输技术，提供了 `p2p` 端到端音频、视频、数据传输的功能，主打`低延时`、同时`支持推拉流`
- `RTMP` 也支持推拉流，不过需要有 `FLASH` 播放器的支持，现在浏览器都禁用了 flash
- 一般会用 HLS 和 HTTP-FLV 进行`拉流`，HLS 和 HTTP-FLV 都是基于 HTTP 协议的
- 延迟方面 HTTP-FLV 比 HLS 好，但在结合`点播场景`下，HLS 下的视频播放比 flv 格式的视频播放更快
- webRTC 相对于 hls 花费要大一些，兼容性 hls 好一些

[音视频处理 RTMP、HLS、HTTP-FLV、WebRTC、RTSP 的区别](https://blog.csdn.net/Daniel_Leung/article/details/130456035)

## 防盗链的实现方式

- 检测 referer 请求头
  - referer：来源页面地址
  - origin: 来源协议、域名、端口（跨域才有）
- 防盗链签名 txSecret=MD5(key + streamId + hex(time)) & txTime = hex(time)
  - 鉴权 Key
    - 从腾讯云上申请，保存在服务器上不要泄漏
  - streamId
    - 随机串、用户 id、房间 id（业务自己定义）
  - txTime
    - 链接有效时间，格式：YYYY-MM-DD HH:MM:SS
- 验证登录态

[防盗链计算](https://cloud.tencent.com/document/product/267/32735)
