## width:100%和 auto 的区别

100%与父元素有关，auto 与子元素有关

## css 选择器

- 简单选择器
  - 元素选择器
  - 类选择器
  - ID 选择器
  - 通用选择器 （\*）
- 组合选择器
  - 多用选择器（A,B）
  - 后代选择器（A B）
  - 子代选择器（A>B）
  - 相邻兄弟选择器（A+B）
  - 通用兄弟选择器（A~B）
- 属性选择器
  - 存在和值
    - [attr] 选择包含所有 attr 的元素
    - [attr=val] 选择 attr 属性等于 val 的元素
    - [attr~=val] 选择 attr 属性的值（以空格间隔出多个值）中有包含 val 值的所有元素 如 [title~=B] title="A B"
  - 子串值
    - [attr|=val] 选择 attr 属性的值以 val（包括 val）或 val-开头的元素（-用来处理语言编码）
    - [attr^=val] 选择 attr 属性的值以 val 开头（包括 val）的元素
    - [attr$=val] 选择 attr 属性的值以 val 结尾（包括 val）的元素
    - [attr*=val] 选择 attr 属性的值中包含字符串 val 的元素
- 伪类选择器（:） active、focus、hover、link、visited、first-child、lang 等
- 伪元素选择器(::) before、after、first-letter、first-line、selection、backdrop 等

!>
[CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)

?>
[伪类和伪元素区别](https://segmentfault.com/a/1190000000484493)

## position 元素定位

- static(正常文档流排列)
- absolute（参考距离最近一个 position 不为 static 的父级元素，如果都没有就相对 html，默认 left 和 top 不设置的话是自动计算当前的 left/top 距离,相对于当前元素距离视图的距离）
- relative（不脱离文档流）
- fixed
- sticky (相当于 relative 和 fixed 的结合体，直到它滚动到某个阈值点（例如，从视口顶部起 1​​0 像素）为止，此后它就变得固定了)

## 浮动

- 浮动元素尽量靠父元素的左上
- 浮动元素之间一个挨着一个排列
- float 产生文字环绕图片的效果(float 脱离`文档流`，但没有脱离`文本流`，而使用绝对定位可以使元素脱离文档流和文本流)

## flex 布局

- flex-direction
  - row
  - row-reverse
  - column
  - column-reverse
- justify-content
  - flex-start
  - flex-end
  - center
  - space-around
  - space-between
- align-items
  - flex-start
  - flex-end
  - center

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## grid 响应式布局

[快速使用 CSS Grid 布局，实现响应式设计](https://www.cnblogs.com/moqiutao/p/8682142.html)

## 双翼布局和圣杯布局

[filename](./code/圣杯布局.html ":include :type=code")

[filename](./code/双翼布局.html ":include :type=code")

- 核心的代码
  ```css
  .content {
    width: 100%;
  }
  .left {
    margin-left: -100%;
  }
  .right {
    margin-right: -200px;
  }
  ```
- 双翼用在 content 中新增一个 div，调整这个 div 的 padding 值来 代替 圣杯用 position:relative 和 left 调整定位位置

!>
[圣杯布局和双飞翼布局的作用和区别](https://www.cnblogs.com/woodk/p/5147085.html)

## CSS 权重优先级

- !important > 行内样式 > id > class、伪类和属性选择器 > 标签和伪元素 >通配符
- !important 如果被用于简写样式，则该简写样式代表的所有子属性都被应用!important 例如 background:blue !important
- 重复样式后面写的覆盖前面
- 都使用!important，看权重
- 样式指向同元素，看权重，权重相同看就近原则（就近原则指的是 css 样式哪个更靠近目标）
- 样式指向不同元素，就近原则

## 基础问题

[50 道 CSS 基础面试问题](https://www.cnblogs.com/ZJTL/p/12591471.html)

### querySelectorAll 和 getElementBy 之间的差别

- querySelectorAll 获取的 nodeList 是静态的
- getElementBy 获取的 nodeList 是动态的，在 Chrome 中叫 HTMLCollection

### 设置元素浮动，元素的 display 变成什么

display:block（触发了 BFC 后，display 都会变成 block）
