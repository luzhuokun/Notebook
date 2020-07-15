## grafana汉化攻略
grafana 是一款采用 go 语言编写的开源应用，主要用于大规模指标数据的可视化展现，是网络架构和应用分析中最流行的时序数据展示工具，目前已经支持绝大部分常用的时序数据库。最好的参考资料就是[官网](http://docs.grafana.org/)，虽然是英文，但是看多了就会啦。

[Grafana 汉化笔记](https://wanghualong.cn/archives/44/#menu_index_1)
[windows搭建本地grafana前端开发环境](https://blog.csdn.net/github_35631540/article/details/107106873?%3E)

[grafana汉化版](https://gitee.com/zch137/grafana-chinese)

## linux环境
### 项目地址
/usr/share/grafana

### 启动grafana-server
sudo service grafana-server start

### 停止grafana-server
sudo service grafana-server stop

### 重启grafana-server
sudo service grafana-server restart

### linux中的grafana.db文件的地址
/var/lib/grafana/grafana.db
