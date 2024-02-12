## 工程化是什么

- 前端工程化就是指在开发过程中制定一系统方案工具去提高开发效率，保证开发质量，降低维护成本的过程
- 主要包括有模块化、规范化、打包构建、自动化测试、自动化部署等方面

## 模块化是什么

- 把一个庞大的代码块进行拆分，拆分成多块然后再组合起来
- 前端模块化主要解决 script 标签引入时带来的`全局污染`和`依赖混乱`的问题

## import 和 require 区别

- import 是 esmodule 的语法，require 是 commonjs 的语法，两者都是前端`模块化`的解决方案
- 默认情况下，esmodule 在浏览器环境下使用，commonjs 在服务器上使用
- import 是静态编译在`编译阶段`执行，require 是动态编译在`运行阶段`执行
- import`导入`的是值的`引用`，类似 linux 符号链接的概念，require 导入的是值的`拷贝`，当导出的值在模块内重新赋值时，不会影响外面的使用，而 import 会

在`浏览器`下使用 commonjs，需要 webpack 进行转换
在`浏览器环境`下使用 esm，需要在 script 标签加上`type=“module”`属性
在`node环境`下使用 esm，node 低版本需要`babel`的支持，高版本（>=13.2）则可以通过在 package.json 上配置 type:'module'属性支持

## monorepo（monolithic repository）

- monorepo 是一个以`一个代码仓库`管理多个项目的代码`管理方式`
- 优点
  - `构建`配置共享
  - `依赖`库共享
  - 方便`版本`控制
- 应用场景
  - 相同业务的多平台项目
  - 多个相互依赖的公共组件库
  - 多页面

## 实现 eslint 自定义插件，自定义了哪些规则

- 自定义规则有：
  - 限制`函数`的`入参`个数
  - 限制 `setTimeout` 中的 `this` 使用
  - 提示使用 `https` 协议
  - 提示使用新的`第三方库`
  - 提示使用新接口
- 通过自定义 eslint 插件，扩充检查规则

eslint 好处：约束团队代码风格统一，使代码更健壮  
eslint 原理：通过`静态代码分析`，根据 AST `抽象语法树`，检查代码是否符合制定的规范

## 前端规范化管理

- 前端规范化就是`统一编码规范`，在开发阶段以及代码提交阶段`保证代码质量`，降低维护成本和沟通成本
- 前端规范化用到的库有：eslint、prettier、husky、commitlint、lint-staged
- 在开发阶段，主要通过 eslint 以及 prettier 进行对代码的检查以及格式化
- 在代码提交阶段，通过 git 钩子，对`文件`、`代码`、`提交信息`、以及`分支命名`进行检查
- 主要涉及的钩子有：commit-msg、pre-commit、pre-push
- `pre-commit` 钩子，在执行 commit 命令时触发，主要包括：
  - `eslint`检查
  - `ts`检查
  - `json文件`检查
  - `文件名`（只允许文件名包含小字母/数字/下划线）
  - `文件后缀`（js/jsx/css/scss/less 不允许）
  - `废弃`的代码用法
  - 以及提示使用新的`第三方库`
  - 多语言翻译缺失检查
- `commit-msg` 钩子，在执行 commit 命令，触发完`pre-commit`钩子后触发，检查`提交信息`是否符合 commitlint 规范
- `pre-push` 钩子，在 push 完成前触发，检查`分支名`是否符合规范

## gitlab-ci 工作流程

- gitlab-ci 是 gitlab 提供的一个`持续集成工具`，通过 gitlab-ci 对提交到远程仓库的代码进行`检查`工作，`保证代码质量`，避免出错发生
- 当我们`push`代码到远程分支时，ci 启动一个`runner`运行器，然后触发一个`pipeline`流水线
- 根据项目根目录下的`.gitlab.yml`，定义的阶段（stage）和作业（job），以流水线的方式执行相关的脚本，检查都通过再把代码合并到远程分支去
  - 一个流水线中包含了多个阶段 stages，每个阶段又包含多个作业 jobs
  - 整个 pipeline 流水线的运行过程，可以在 gitlab 上的 `pipeline 页面`查看
- 在我们项目中，利用 gitlab-ci 做了以下`检查`，包括：
  - eslint
  - ts 语法
  - json 结构
  - 文件名
  - 文件后缀
  - 废弃代码
  - 废弃包
  - 多语言翻译缺失检查

只有一个 runner 的情况下，同一时间只能做一个 job
gitlab-ci 会对项目上`所有代码`做一次全面检查，git hooks 钩子配合 lint-staged 针对每次代码提交都做检查，所以我们是只对合并到 master 分支时才做 ci 检查，其他分支通过 git hooks 配合 lint-staged 来保证代码质量

?>
[GitLab CI 流水线配置文件.gitlab-ci.yml 详解](https://meigit.readthedocs.io/en/latest/gitlab_ci_.gitlab-ci.yml_detail.html)

## jenkins 如何创建工作，以及工作流程

- 创建任务
- 配置 gitlab `仓库` 地址、账号密码、分支
- 配置`构建脚本`
- 配置`发布脚本`
- `当需要`构建的时候，登录 jenkins ，选择需要构建的 job，输入构建时的一些参数，点击构建就能开始构建了

## 多构建工具对比

- [webpack](https://www.npmjs.com/package/webpack)
  - `模块化`打包工具
  - 以 js 作为 entry 入口
  - 工程化能力完善，社区活跃，使用人数最多的打包工具
- [vite](https://www.npmjs.com/package/vite)
  - 开发基于 esm 和 esbuild，生产基于 rollup
  - 基于 esm 不需要打包编译，冷启动非常快
  - 利用 esbuild 预编译加速，合并第三方依赖包减少 http 请求
    - esbuild 基于 go，主打编译性能更优秀，快 10-100 倍（esbuild 也有打包能力，但是不够完善，暂时用来做编译、压缩用）
  - 弊端：开发和生产构建不一致
- [rollup](https://www.npmjs.com/package/rollup)
  - 最早提出 `tree shaking`
- `snowpack`（不维护了）
  - 第一个提出利用浏览器原生 esm 能力的工具
  - 现在不维护了，被 vite 淘汰了
- `grunt/gulp`
  - 基于`工作流`打包，webpack 出现之前的打包工具，现在很少人使用了，退出历史舞台
- `parcel`
  - 主打`零配置`
  - 利用 cpu `多核编译`
  - 基于 `swc`（Speedy Web Compiler 基于 rust 编写） 做编译，比 babel 快十几倍（swc 也有 bundle 打包能力，但是还不够完善），目前 swc 支持 webpack 转换 es5，不支持 vite 转 es5，Vite 默认最低只能转成 es2015(es6)语法（vite、esbuild 不支持直接转成 es5）,需要通过@vitejs/plugin-legacy（基于 babel）转成 es5
    页面兼容问题（安卓不支持 fontsize 小于 1 的情况）
  - 以 html 作为编译入口
  - 但社区不活跃，使用者不多
- [turbopack](https://www.npmjs.com/package/turbo)
  - 基于 rust
  - 函数级别缓存的增量编译
  - 按请求编译
  - 未来 webpack 的替代品，不兼容 webpack 插件，现在生态还不完善
- [rspack](https://www.npmjs.com/package/@rspack/core)
  - ByteDance 团队研发
  - 基于 rust
  - 兼容 webpack 插件
  - 目前仅支持内存级别缓存
- 未来会有越来越多的像 swc、esbuild、turbopack 这些工具的出现，他们天生的`语言优势`，执行效率上完胜 js 语言
  - rust 是一门`编译型语言`，比`解释型语言`运行快很多

[前端模块化打包工具对比分析](https://juejin.cn/post/7207760939264311333)
[swc、esbuild 和 vite 前端构建工具浅析](https://juejin.cn/post/7137116101367824420)

## 多页面开发阶段卡顿问题优化方案

- 卡顿现象
  - 100+ h5 活动页面，当我更新一个文件时，webpack 重新编译总是卡在 94%不动，需要等待 10 多秒才编译完成
- 分析手段
  - 通过在启动命令中加入 --profile 命令，分析耗时发生在 asset optimization 耗时
- 根本原因
  - html-wepback-plugin 插件存在性能问题，在 webpack 的 emit 阶段钩子函数里有些代码逻辑重复执行了多遍
  - 当某个 chunk 内的文件更新时，其他所有的 chunk 入口都会跟着改变，webpack 的 emit 阶段内的代码都会重复执行一遍从而造成性能问题
- 优化措施
  - 通过`动态配置`的方式，只编译加载我想要开发的那个页面的模块文件，但是在多人维护的场景下，可能会造成代码冲突的情况
    - 弊端：每个开发者更改自己的 config 配置，极容易造成提交记录的冲突
  - `更换html插件`，使用 html-webpack-plugin-for-multihtml，但后来没维护了，如果继续用会留下隐患
    - 策略：优化 webpack 的 emit 阶段执行时间，主要增加了判断和缓存功能
    - 弊端：在 2019 年 6 月后已经停止维护，被 html-webpack-plugin 4 替代
  - （推荐）`升级 html-webpack-plugin 到版本4 以上`(2020 年发布)，版本 4 以上优化了本地开发时多页面的 HMR 热更新问题
    - 策略：让 emit 阶段代码仅执行一次
    - 成效：优化到 3 秒以内
  - 其他
    - 使用其他构建工具
      - parcel：以 html 作为入口编译的构建工作，parcel 编译时利用多核多线程
    - 使用更轻量的应用框架
      - svelte
      - solid

[html-webpack-plugin 4.x 对多模板下热重载缓慢问题的修复](https://juejin.cn/post/6844903961527336968#heading-7)
[Webpack 多页应用 HMR 卡住问题](https://juejin.cn/post/6844903828844707848)
