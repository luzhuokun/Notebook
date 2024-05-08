## 常用命令

### 递交代码

git add .  
git commit -m 'xxx'  
git push

### 配置

git config [--local|--global|--system] -l  
git config [--local|--global|--system] -e  
git config [--local|--global|--system] --add section.key value(默认是添加在 local 配置中)  
git config [--local|--global|--system] --unset section.key

### 把代码还原到 commit_id 的位置

git reset commit_id(commit_id 通过 git log 查)

### 添加远程仓库

git remote add example git@github.com:yourUserId/example.git

### git 命令修改 commit 时的用户名和邮箱地址

#### 查询

git config user.name
git config user.email

#### 修改

git config user.name xxxx
git config user.email xxxx

#### 修改全局

git config --global user.name xxxx
git config --global user.email xxxx

### 强制推送

git push origin <you_branch_name> -f

### 删除远程某个分支

git push origin -d branchName

### 查看远程分支信息

git remote show origin

### 移除本地已过时的远程分支

git remote prune origin

### 解决 git 无法检测文件名大小变更

git config core.ignorecase false
