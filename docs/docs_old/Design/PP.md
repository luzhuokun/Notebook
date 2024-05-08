# 编程范式

## 面向过程编程 POP

着重关注`怎么做`，把一个任务拆分成各个小步骤，依次调用这些小步骤函数，以此来完成任务。

## 面向对象编程 OOP

着重关注`谁来做`，抽象出各种角色对象，分别给予一些能力，然后使他们相互之间配合，以此来完成任务。

### 三要素

封装、继承、多态

## 函数式编程 FP

函数是第一公民，以函数作为参数传入，允许返回函数，纯函数没有`副作用`，不修改状态，引用透明。

### 特点

- 函数是第一等公民
- 无副作用
- 不修改状态
- 引用透明
- 只用表达式而不是语句，即单纯地计算，且有返回值

## 面向切面编程 AOP

- 不修改原业务代码的情况下扩展功能，从业务处理过程中的切面入手，`动态植入`代码，不影响原业务流程代码。
- 实现方式：装饰器模式
- 应用场景：日志记录、性能测试、异常处理等

## 命令式编程

- 一步一步告诉计算机先做什么再做什么，关注`怎么做`
- 比如 jQuery

## 声明式编程

- 以数据结构的形式来表达程序执行的逻辑，告诉计算机应该`做什么`，但不指定具体要怎么做
- 比如 React 和 Vue