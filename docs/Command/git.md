
## 常用命令

### 递交代码
git add .  
git commit -m 'xxx'  
git push  

### 配置
git config [--local|--global|--system] -l  
git config [--local|--global|--system] -e  
git config [--local|--global|--system] --add section.key value(默认是添加在local配置中)  
git config [--local|--global|--system] --unset section.key  

### 把代码还原到commit_id的位置
git reset --hard commit_id(commit_id通过git log查)
