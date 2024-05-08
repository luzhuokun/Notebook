redis 上的存储都是 key-value 的存储方式

## String 字符串

- value 最大值不能超过 512MB
- 设置方式：set key value
- 应用场景：可以存任何数据，比如数字、图片、二进制等，用于缓存、计数、共享 Session、限速

## Hash 哈希

- 一个键值对应集合
- 设置方式：hmset key field1 "Hello" field2 "World"
- 应用场景：存对象、存用户数据

## List 列表

- 双端链表，按照插入顺序排序
- 设置方式：lpush key member
- 应用场景：文章列表、消息队列

## Set

- 字符串类型的无序集合且元素唯一
- 设置方式：sadd key member
- 应用场景：用户标签、共同好友

## Sorted Set

- 字符串类型的有序集合且元素唯一，但每个元素都会关联一个 double 类型的分数,会根据这个分数来排序
- 设置方式：zadd key score member
- 应用场景：得分排行榜

## 发布订阅

- subscribe 订阅 channel 频道
- publish 向 channel 频道发布字符串消息
- 通过 on 监听 message 接收消息，然后根据回调的第一个参数 channel 频道来区分是哪里频道来的消息
- 应用场景：聊天、群聊

### AOF 日志

redis 有持久化备份机制包括全量备份和增量备份，通过增量备份进行数据存储在宕机后快速重启数据库然后进行这个增量 AOF 日志的恢复，虽然性能上会有点消耗，但这是值得的。
