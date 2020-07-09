
## 导出数据库
mysqldump -uroot -p gdds >./gdds.sql
## 导出指定的数据表
mysqldump -uroot -p joymusic_bs_hnmg entity_song entity_song_res entity_artist entity_activity daily_view_recommend user_info user_collect > ./joymusic_bs_hnmg_20200313.sql

## 导出数据库 忽略t_resource_access_log表
mysqldump -S /tmp/mysql_huawei.sock -u root -p --databases opera_gansu --ignore-table=opera_gansu.t_resource_access_log > opera_gansu.sql
## 导出t_resource_access_log表结构
mysqldump -uroot -p -d toy_shaanxi t_resource_access_log >./t_resource_access_log.sql
