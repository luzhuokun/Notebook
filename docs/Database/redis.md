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
