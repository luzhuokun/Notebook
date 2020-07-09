
## 查看进程信息
ps  -ef | grep nginx

## 查看最近100条操作记录
history 100

## 查看端口占用
netstat   -nultp（此处不用加端口号）

## 查看指定端口占用
netstat  -anp  |grep   端口号

## 放开防火墙步骤

1. 查看状态：iptables -L -n
2. 直接编辑：vim /etc/sysconfig/iptables
3. 端口开放：-A INPUT -m state --state NEW -m tcp -p tcp --dport 18080 -j ACCEPT
4. 保存文件：:wq
5. 重启防火墙：service iptables restart

?> 备注：批量开端口 -A INPUT -p tcp -m tcp --dport 18080:18090 -j ACCEPT

## scp
### 下载文件
scp root@107.172.27.254:/home/test.txt ./
### 上传文件
scp test.txt root@107.172.27.254:/home
### 下载目录
scp -r root@107.172.27.254:/home/test ./
### 上传目录
scp -r test root@107.172.27.254:/home
