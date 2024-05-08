## mac 使用 Homebrew 安装 MongoDB

https://www.jianshu.com/p/d929436a4b7c

## 配置文件位置

/etc/mongod.conf

## log 文件位置

/var/log/mongodb/mongod.log

## sock 文件位置

/tmp/mongodb-27017.sock

## 远程登录

mongo 127.0.0.01:27017

## mongo 远程连接设置

命令：vim /etc/mongodb.conf  
bind_ip=127.0.0.1，这一行注释掉或者是修改成 bind_ip = 0.0.0.0  
port = 27017，这一行为监听端口  
auth=true，这一行为登陆验证

## 宕机恢复

[mongodb 日志以及异常关机后的恢复]https://blog.csdn.net/jingmo55/article/details/8818515

## 启动 mongo 服务

mongod -f /etc/mongod.conf  
不行的话试试 service mongod restart

## 导出

mongoexport -d music*shanxi -c acl* -o acl\_.json

## 导入

mongoimport -d gdds_xes -c acl_user --file acl_user.json

## 创建用户

use gdds_chongqing_iptv50;  
db.createUser({user:"gdds",pwd:"dongshiwangluo",roles:[{role:"readWrite",db:"gdds_chongqing_iptv50"}]});  
db.createCollection("access_log");  
db.access_log.ensureIndex({"startTime":1});

## 索引

查看索引 db.COLLECTION_NAME.getIndexes()  
创建、添加索引 db.COLLECTION_NAME.ensureIndex(keys[,options])

## 修改

db.acl_user.update({"name":"xxx"},{$set: {"type" : "superAdminInTech"}})

## 启动 mongo 进程

/usr/local/mongodb/bin/mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork

ps aux | grep -v grep | grep mongod

https://www.runoob.com/mongodb/mongodb-osx-install.html
