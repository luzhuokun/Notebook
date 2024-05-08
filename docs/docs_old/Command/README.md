## ps 进程状态

**查看进程信息** ps -ef | grep nginx

## kill 杀死进程

**重新加载进程** kill -1 12345  
**彻底杀死进程** kill -9 12345  
**正常停止一个进程** kill -15 12345

## history 历史操作

**最近 100 条操作记录** history 100

## tcpdump 网络包分析命令

[filename](./tcpdump.md ":include")

## netstat 网络状态

**所有端口占用** netstat -nultp

**指定端口占用** netstat -anp |grep 8080

## nslookup 查询域名解析

nslookup domain [114.114.114.114] // 如果没有指定 dns 服务器，就采用系统默认的 dns 服务器，8.8.8.8 是谷歌提供的 DNS 服务器

## iptables 防火墙

**放开防火墙步骤**

1. 查看状态：iptables -L -n
2. 直接编辑：vim /etc/sysconfig/iptables
3. 端口开放：-A INPUT -m state --state NEW -m tcp -p tcp --dport 18080 -m comment --comment "allow ssh to this host from anywhere" -j ACCEPT
4. 保存文件：:wq
5. 重启防火墙：service iptables restart

?> 备注：批量开端口 -A INPUT -p tcp -m tcp --dport 18080:18090 -j ACCEPT

## scp 远程拷贝

**下载文件** scp root@107.172.27.254:/home/test.txt ./  
**上传文件** scp test.txt root@107.172.27.254:/home  
**下载目录** scp -r root@107.172.27.254:/home/test ./  
**上传目录** scp -r test root@107.172.27.254:/home

## npm 包管理

### 发布 npm 包

- 发包前要注意是否已经登录，如果没有的话执行 npm login
- npm publish (注意公有包要加上 --access public)

### 删除 npm 包

- npm unpublish [<@scope>/]<pkg>@<version>
- npm unpublish [<@scope>/]<pkg> --force (超过 24 小时)

## nrm npm 的镜像源管理工具

nrm 是一个 npm 源管理器，允许你快速地在 npm 源间切换。

**查看可用镜像源** nrm ls

**切换镜像源** nrm use taobao

**添加镜像源** nrm add <registry> <url>

**删除镜像源** nrm del <registry>

?> [nrm 安装与使用](https://www.cnblogs.com/Jimc/p/10280774.html)

## crontab 定时任务命令

**编辑定时任务** crontab –e  
**启动服务** service crond start  
**关闭服务** service crond stop  
**重启服务** service crond restart  
**重新载入配置** service crond reload
