## css3 新特性

- 布局
  - flex
  - grid
- 动画
  - animation
  - 定义关键帧 @keyframes name {}
  - 变换 transform
    - 旋转 rotate
    - 缩放 scale
    - 平移 translate
- 过渡效果
  - transition
- 过滤
  - filter
- 渐变
  - background: linear-gradient(to bottom, #ff0000, #ffff00);
- css 变量
  - 一处定义多处使用的效果
    - 语法是采用 -- 开头的变量名，然后冒号属性的写法定义
    - 然后使用时通过 var 括号包住
  - 适用于换肤场景

## nth-of-type(n)和 nth-child(n)的区别

- nth-of-type(n) 先根据类型再选取第 n 个指定子元素
- nth-child(n) 选取第 n 个子元素再匹配类型，类型相同才生效

## BFC(block format content) 块级格式化上下文

- 创建一个独立的渲染区，不影响兄弟元素或父子元素的渲染
- 解决 margin 重叠、高度坍塌问题
- 创建方式
  - overflow:hidden
  - display:flex
  - float
  - position:absolute 和 fixed

## 介绍一下盒子模型

- content-box(标准盒子) width = content 内容大小
- border-box(非标准盒子) width = border + padding + content 内容大小

## link 和 import 区别

- link 是 html 的标签，import 是 css 的语法
- link 支持并行下载（异步不阻塞渲染），多个 import 导入的 css 文件需要按顺序加载（同步）
- link 兼容性比 import 好
- link 支持 js 动态插入和修改，import 不支持通过 JavaScript 动态插入或修改
- link 支持换肤、首屏的场景，import 支持模块化场景

## 伪类和伪元素的区别

- 伪类相当于给元素加一个类，伪元素相当于给元素附近加一个 dom
- 伪类一个冒号表示:，伪元素两个冒号表示::
- 伪类
  - :hover
  - :focus
  - :active
  - :disabled
  - :nth-child(n)
  - :nth-of-type(n)
- 伪元素
  - :before
  - :after

## 水平垂直居中

- flex
  - display:flex;
  - justify-content:center;
  - align-items:center;
- position + transform
  - position:absolute;
  - top:50%;
  - left:50%;
  - transform:translate(-50%, -50%);
- grid
  - place-items: center;
- table + margin:auto
  - width:100px;
  - margin:auto;（水平对齐）
  - vertical-align: middle;（垂直对齐）
