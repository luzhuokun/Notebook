!>
[react官方文档](https://react.docschina.org)  
[redux官方文档](https://www.redux.org.cn)  

## redux源码原理分析
[Redux入口教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

[filename](../Utils/Polyfill/redux/store.js ':include')

## React15和15的diff区别

- 16是链表形式的虚拟dom结构，每个节点都是一个Fiber，而15是树结构，每个节点都是虚拟dom
- 16在diff阶段是可中断、暂停、复用渲染任务，让每一个Fiber的diff和patch都变得可控，15中的diff是不可中断的
- 从递归树状结构，变成循环遍历链表的形式
- 16加入了工作循环、优先级策略

[React 15的diff和React16的区别](https://blog.csdn.net/halations/article/details/109284050)
