redis上的存储都是key-value的存储方式

## String
字符串
存储元素类型包括字符串、数值、二进制
- 设置方式：set key "string"
## Hash
哈希
一个键值对应集合
- 设置方式：hmset key field1 "Hello" field2 "World"
## List
简单的字符串列表，按照插入顺序排序
- 设置方式：lpush key member
## Set
字符串类型的无序集合且元素唯一
- 设置方式：sadd key member
## Sorted Set
字符串类型的有序集合且元素唯一，但每个元素都会关联一个double类型的分数,会根据这个分数来排序
- 设置方式：zadd key score member 
## 订阅发布
- subscribe订阅channel频道
- publish向channel频道发布字符串消息
- 通过on监听message接收消息，然后根据回调的第一个参数channel频道来区分是哪里频道来的消息

## mysql、mongo、redis的区别
- `mysql`是关系型数据库，支持事务
- `mongo`和`redis`是非关系型数据库，不支持事务
- `mongo`适合存储不确定结构的数据（比如一些用户记录信息），`mysql`适合存储大量数据且结构固定有关系的数据，但查询起来可能会很慢（给需要经常查询的字段加索引）
- `redis`配合`mysql`使用，缓存一些经常要查询的结果，比如用户在线状态、排行榜信息等

### AOF日志
redis有持久化备份机制包括全量备份和增量备份，通过增量备份进行数据存储在宕机后快速重启数据库然后进行这个增量AOF日志的恢复，虽然性能上会有点消耗，但这是值得的。
