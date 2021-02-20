## width:100%和auto的区别

100%与父元素有关，auto与子元素有关

## 盒子模型

- 标准模型 box-sizing:content-box (width = content内容宽度)
- 非标准模型（IE） box-sizing:border-box (width = border + padding + content)

## css选择器

- 简单选择器
  - 元素选择器
  - 类选择器
  - ID选择器
  - 通用选择器 （*）
- 组合选择器
  - 多用选择器（A,B）
  - 后代选择器（A B）
  - 子代选择器（A>B）
  - 相邻兄弟选择器（A+B）
  - 通用兄弟选择器（A~B）
- 属性选择器
  - 存在和值
    - [attr] 选择包含所有attr的元素
    - [attr=val] 选择attr属性等于val的元素
    - [attr~=val] 选择 attr 属性的值（以空格间隔出多个值）中有包含 val 值的所有元素 如 [title~=B] title="A B"
  - 子串值
    - [attr|=val] 选择attr属性的值以val（包括val）或val-开头的元素（-用来处理语言编码）
    - [attr^=val] 选择attr属性的值以val开头（包括val）的元素
    - [attr$=val] 选择attr属性的值以val结尾（包括val）的元素
    - [attr*=val] 选择attr属性的值中包含字符串val的元素
- 伪类选择器（:） active、focus、hover、link、visited、first-child、lang等
- 伪元素选择器(::) before、after、first-letter、first-line、selection、backdrop等

!>
[CSS选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)

?>
[伪类和伪元素区别](https://segmentfault.com/a/1190000000484493)

## position元素定位

- static(正常文档流排列)
- absolute（参考距离最近一个position不为static的父级元素，如果都没有就相对html，默认left和top不设置的话是自动计算当前的left/top距离,相对于当前元素距离视图的距离）
- relative（不脱离文档流）
- fixed
- sticky (相当于relative和fixed的结合体，直到它滚动到某个阈值点（例如，从视口顶部起1​​0像素）为止，此后它就变得固定了)

## 浮动

- 浮动元素尽量靠父元素的左上
- 浮动元素之间一个挨着一个排列
- float产生文字环绕图片的效果(float脱离`文档流`，但没有脱离`文本流`，而使用绝对定位可以使元素脱离文档流和文本流)

## flex布局

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

## CSS权重优先级

- !important > 行内样式 > id > class、伪类和属性选择器 > 标签和伪元素 >通配符
- !important如果被用于简写样式，则该简写样式代表的所有子属性都被应用!important 例如background:blue !important
- 重复样式后面写的覆盖前面
- 都使用!impotant，看权重
- 样式指向同元素，看权重，权重相同看就近原则
- 样式指向不同元素，就近原则

## 双翼布局和圣杯布局

[filename](./code/圣杯布局.html ':include')
[filename](./code/双翼布局.html ':include')

!>
[圣杯布局和双飞翼布局的作用和区别](https://www.cnblogs.com/woodk/p/5147085.html)

## 基础问题
[50道CSS基础面试问题](https://www.cnblogs.com/ZJTL/p/12591471.html)

### 设置元素浮动，元素的display变成什么
display:block（触发了BFC后，display都会变成block）
