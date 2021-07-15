!>
[react官方文档](https://react.docschina.org)  
[redux官方文档](https://www.redux.org.cn)  

## fiber架构
- 在浏览器空闲的时候再执行任务，把主线程腾出时间来处理其他更紧急的任务（时间分片）（底层技术api requestIdleCallback）
- 把任务拆分碎片化
- fiber采用链表树，每一个fiber节点包含3个指针，分别指向parent、child和sibling（相邻的节点）

## redux源码原理分析
[Redux入口教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

[filename](../Utils/Polyfill/redux/store.js ':include')

## React15和16的diff区别

- 16是链表形式的虚拟dom结构，每个节点都是一个Fiber，而15是树结构，每个节点都是虚拟dom
- 16在diff阶段是可中断、暂停、复用渲染任务，让每一个Fiber的diff和patch都变得可控，15中的diff是不可中断的
- 从递归树状结构，变成循环遍历链表的形式
- 16加入了工作循环(requestIdleCallback)、优先级策略

[React 15的diff和React16的区别](https://blog.csdn.net/halations/article/details/109284050)

## hook钩子理解

- 在不编写class的情况下使用state及其他的react特性
- 清楚地知道数据的来源，让组件内逻辑清晰
- 只能在函数组件中使用，约定名称是use开头

[关于React中useEffect以及Hooks的思考](https://www.jianshu.com/p/101ce42b8800)

## shouldComponentUpdate
凡是调用setState都会触发render，即使state没有改变，为了避免性能上的浪费，React 提供了一个 `shouldComponentUpdate` 来控制触发 vdom re-render 逻辑的条件  

## immutable.js
- 保持原有的数据结构不变
- 生成不被改变的数据，优于深拷贝

!>[immutable详解](https://www.jianshu.com/p/e839d5b9f7cc)
