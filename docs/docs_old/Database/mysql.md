## 远程登录

mysql -h 127.0.0.1 -u root -p -P 3306

## 导出数据库

mysqldump -uroot -p gdds >./gdds.sql

## 导出指定的数据表

mysqldump -uroot -p joymusic_bs_hnmg entity_song entity_song_res entity_artist entity_activity daily_view_recommend user_info user_collect > ./joymusic_bs_hnmg_20200313.sql

## 导出数据库并忽略 t_resource_access_log 表

mysqldump -uroot -p --ignore-table=kids_chongqing.t_resource_access_log kids_chongqing>./kids_chongqing.sql

## 导出 t_resource_access_log 表结构

mysqldump -uroot -p -d toy_shaanxi t_resource_access_log >./t_resource_access_log.sql
