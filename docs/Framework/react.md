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

## hooks钩子理解
- `特点`：增强副效应中代码的可复用性、使函数组件有状态
- 钩子（hook）就是 React 函数组件的副效应解决方案，用来为函数组件引入副效应  
[轻松学会 React 钩子：以 useEffect() 为例](http://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)
[关于React中useEffect以及Hooks的思考](https://www.jianshu.com/p/101ce42b8800)

## showComponentUpdate
凡是调用setState都会触发render，即使state没有改变，为了避免性能上的浪费，React 提供了一个 `shouldComponentUpdate` 来控制触发 vdom re-render 逻辑的条件  

## immutable.js
- 保持原有的数据结构不变
- 生成不被改变的数据，优于深拷贝

!>[immutable详解](https://www.jianshu.com/p/e839d5b9f7cc)
