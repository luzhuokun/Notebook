## 常用命令

### 首先将目录树 checkout 到本地

svn co http://svn_test_url.com/test_dir my_checkout --depth immediates  
--depth empty：只包含目录自身，不包含目录下的任何文件和子目录。  
--depth files： 包含目录和目录下的文件，不包含子目录。  
--depth immediates： 包含目录和目录下的文件及子目录。但不对子目录递归。  
--depth infinity： 这是默认的，包含整个目录树。

### 将你不想 co 的目录排除在外

svn update --set-depth exclude dir1 dir2

### 更新你想要的 scripts 目录

svn update --set-depth infinity scripts/

### svn merge 命令的使用

将 url 指定的 code 的 xxxx 版本到 yyyy 版本，merge 到本地（注意：该方式不包括 xxxx 版本！！）  
svn merge url -r xxxx:yyyy ./ --dry-run 加上这个--dry-run 是模拟合并，如果要真实合并则去掉

### svn 回退/更新/取消某个版本

先 svn up 保证更新到最新的版本，如 20；  
后 svn merge -r 20:10 [文件或目录] 回滚到版本号 10

### svn 查最近的 3 条记录

svn log -l 3

### svn 查看忽略的文件或文件夹

svn pg svn:ignore -R

### 设置忽略的文件

svn propset svn:ignore "logs node_modules" ./

### 拉出新分支 前旧后新

svn cp http://121.199.61.174:18080/svn/yunnan/branches/yunnan_new_2018 http://121.199.61.174:18080/svn/yunnan/branches/yunnan_new_2020 -m "拉出一个新版云南电信"

### 递归恢复文件

svn revert -R xxx
