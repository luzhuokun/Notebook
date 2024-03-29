## 什么是索引，使用索引有什么好处

- 对数据库表中一列或者多列值进行`排序`的数据结构
- 好处：提高查询效率
- 坏处：降低增删改效率

## 为什么 MySQL 采用 B+ 树作为索引？

- 不使用索引，全表查询的时间复杂度是 O(n)
- 线性存储
  - 时间复杂度 O(n)
- 二叉树存储
  - 时间复杂度 O(log n)
  - 弊端：当每次插入时都插入最大值，则退化成链表结构
- 自平衡二叉树
  - 条件约束：每个节点的左子树和右子树的高度差不超过 1
- B 树
  - 有多个子节点的平衡多叉树
  - 为了降低树的高度，让子节点有 M 个
  - 每个节点都包含数据（索引+记录）
  - 弊端：查询不稳定，查的节点如果是非叶子节点可能会很快找到，如果是叶子节点的话可能会很慢才找到
- B+树
  - 时间复杂度 O(log n)
  - B 树升级版，有序的平衡多叉树
  - 叶子节点才放真实的数据，非叶子节点只放索引
  - 所有索引都会在叶子节点出现，叶子节点之间构成一个有序链表
  - 非叶子节点索引同时存在于子节点中，非叶子节点有多少个子节点，就有多少个索引

[为什么 MySQL 采用 B+ 树作为索引？](https://xiaolincoding.com/mysql/index/why_index_chose_bpuls_tree.html#%E6%80%8E%E6%A0%B7%E7%9A%84%E7%B4%A2%E5%BC%95%E7%9A%84%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E6%98%AF%E5%A5%BD%E7%9A%84)

## mysql 中有哪些索引

- `普通索引`：允许重复和空值，可以设多个
- `唯一索引`：不允许重复、允许空值，可以设多个
- `主键索引`：不允许重复、不允许空值，只能设一个
- `组合索引`
  - 允许重复、不允许空值，可以设多个
  - 多列字段组成的索引，遵循`最左前缀匹配`原则，越常用的字段放在越左边（出现了定义时最左边的字段才会激活索引）
- `全文索引`：允许重复和空值，在 CHAR、VARCHAR、TEXT 类型的列上创建

## mysql、mongo、redis 的区别

- mysql
  - 关系型数据库
  - 表结构存储
  - 支持磁盘存储
  - 支持事务
  - 适用场景：各种常规的业务需求
  - 扩展方式：主从复制、主主复制和分区表
- mongo
  - 非关系型数据库
  - json 结构存储
  - 同时支持内存和磁盘存储
  - 支持事务
  - 适用场景：日志记录、大数据量、复杂查询和灵活性要求高
  - 扩展方式：通过副本集和分片
- redis
  - 非关系型数据库
  - 健值对存储格式
  - 存储在内存上
  - 适用场景：缓存、消息队列等
  - 扩展方式：集群
  - 使用 redis 做缓存时要注意
    - `缓存穿透`，访问一个`不存`在的 key，缓存不生效，直接请求到 DB 上。解决：缓存空对象、布隆过滤器
    - `缓存击穿`，访问一个存在的 key，某一刻突然`过期`，直接打到 DB 上。解决：设置 key 永不过期、使用分布式锁（限制只有一个请求能请求到数据库上，其他等待）
    - `缓存雪崩`，某一时刻大量 key 过期，解决：把每个 key 过时间打散、设置 key 永不过期、加锁
  - 场景：用户状态列表、排行榜
  - 存储格式：字符串、哈希、列表、集合、有序集合

### 如何预防数据库故障

- 主主，提供两台数据库读写，数据双向同步
- 主从，提供一台数据库读写，另一台只读，数据从主库同步到从库
- 主备，提供一台数据库读写，另一台只做备份，主库挂了就取代主库
- 集群，多个主机负载均衡

[聊聊 MySQL 主从](https://juejin.cn/post/7070290856967667742#heading-5)
[深入解析 MySQL binlog](https://zhuanlan.zhihu.com/p/33504555)

### 如何进行主从数据同步

- binlog 日志，以事务的形式保存在磁盘中

### 主从延迟原因

- 机器性能
- 大事务（拆成小事务执行）
- 从库查询压力太高
- 网络延迟
- 从数据库过多（一般 3-5 个为宜）
- Mysql 版本低不支持多线程复制，需要升级版本

## redis 为什么速度快

- `存储在内存`，读写速度快
- `IO多路复用`，多个 TCP 链接由一个线程处理
- `单线程处理`网路 IO 和读写（持久化、异步删除通过其他线程处理）
- `精简的数据结构`（字符串、哈希、集合、列表）和优秀的算法（布隆过滤器）
