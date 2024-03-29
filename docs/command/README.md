## git merge 和 git rebase 的区别

- 从最终的结果看，都是把`代码合并`到一起去；
- git merge 合并代码时会`产生`额外的`合并记录`；
- git rebase 合并就是变基，从共同的祖先记录开始，基于最新的 A 分支提交记录来重新合并 B 分支的提交记录；
- git rebase `不会产生`新的合并记录，会使项目历史更加的整洁，但在协作分支上`不建议`使用 git rebase，会对其他协作者产生影响；

## gitlab review

- 常见的 code review 有两种方式：本地方式和远程方式
- `本地方式`，通过把远程代码拉到本地合并进行 review
- `远程方式`，通过在 gitlab 平台上发起 merge request 进行 review

## gitflow 工作流

- 划分 master 生产分支、dev 开发分支、feature 功能分支、还有 bugfix 问题修复分支
- 每次发版，把每个人的功能分支合并到 dev 开发分支，然后把 dev 开发分支合并到生产分支 master，最后打上 tag 版本标签

## npm yarn pnpm 区别

- npm yarn 和 pnpm 都是包管理工具，用于`管理` node_modules 中依赖包的加载卸载等问题
- npm 和 yarn 存在多个项目不能复用依赖包的问题
- pnpm 通过软硬链接和全局共用依赖包(跨项目依赖包复用)的方式，`节省`大量（60%以上）`磁盘空间`，很好地`解决幽灵依赖`。（通过把依赖包统一安装到 pnpm 全局管理的 `store 目录`下；把模块包的嵌套结构隐藏在 node_module 中的.pnpm 目录下，然后通过`软链接`（符号链接）的方式映射回上层的 node_module 目录下，然后通过.pnpm 目录下的模块包通过`硬链接`的方式链接到 store 目录下的模块包）

?>

- 在 npm1/2 会按照 package.json 结构递归地加载依赖包，造成大量重复依赖包，浪费大量的磁盘空间
- npm3 开始采用“扁平化”方式代替“嵌套式”安装依赖包，虽然解决了大部分场景但还是会存在`重复下载`依赖的问题，并且还带来了`幽灵依赖`这个新问题（即：没有在 package.json 上声明的包，在某些依赖包安装时顺带下载下来了，并且能直接使用）
- pnpm 采用“嵌套式”安装依赖包，然后通过软链接复用

### pnpm 命令

- `pnpm i 包名 -S/-D -w`
  - -w 全局安装
- `pnpm i 包名 -S/-D`
  - 直接切换到子包的目录进行安装
- `pnpm i 包名 -S/-D --filter 子包的名称`
  - --filter 是用来指定子包
- `pnpm i 子包1 --filter 子包2`
  - 通过这个命令，可以在子包 2 中引用子包 1

[pnpm run](https://pnpm.io/zh/cli/run)

## 软链接和硬链接的区别

- 软链接和硬链接都是用来`访问同一个文件`
- 当`删除源文件`时，软链接会失效，硬链接不会
- 软链接像`快捷方式`，是一个指向源文件索引节点（inode）的引用，软链接不仅能链接文件还能链接目录
- 硬链接像一个`备份`，是指向同一个索引节点的指针，会把源文件的引用计数增加，当引用计数为 0 时代表文件被删除（数据其实还在，如果想真正地删除文件，应该反复地进行文件内容的覆盖删除等操作）
