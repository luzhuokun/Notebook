设计模式

[设计模式](https://www.runoob.com/design-pattern/design-pattern-tutorial.html)
[UML 类图](https://blog.csdn.net/fox9916/article/details/128883825)

- 创建型
  - 特点：隐藏创建逻辑
- 结构型
  - 特点：构建更灵活、可复用的类和对象
- 行为型
  - 类行为（通过`继承`分派行为）
  - 对象行为（通过`组合/聚合`分派行为）
  - 特点：关注对象的通信和交互

## 工厂模式(Factory)

- 通过一个统一的方法来创建一类的对象，封装创建对象的细节

## 建造者模式(Builder)

- 通过多个简单的对象组合构建成一个复杂对象，创建更灵活

## 单例模式(Singleton)

- 多次调用类进行创建也只有一个实例
- 适合只需要一个全局实例的场景，比如 vuex

## 装饰器模式(Decorator)

- 在不破坏`封装`和`继承`的情况下，增强和扩展类的功能
- 在 es6 中可以对类及类的属性进行装饰，但不能直接对普通函数进行装饰，因为函数定义存在函数提升无法装饰（因为装饰器也是个函数，函数提升时还没定义好就调用，会报错）
- 使用场景：数据上报、增强函数用法

## 桥接模式(Bridge)

- 抽象和实现分离解耦，两者独立变化
- 画不同颜色形状的圆

## 观察者模式(Observer)

- 通过被观察者提供 api 给观察者，完成`一对多`通信
- 角色包括：观察者和被观察者

## 发布订阅模式(Publish-Subscribe)

- 通过一个中间人角色帮忙转发消息，发布者和订阅者可以根据不同的事件进行监听和触发，跟观察者模式相比更加的解偶
- 角色包括：中间人、发布者、订阅者

## 备忘录模式(Memento)

- 在对象之外保存状态，然后在需要时进行恢复
- 备忘录模式三个角色：`发起人`、`管理中心`、`备忘录`（多）。状态如何保存和恢复的逻辑封装在管理者上，发起者可以不用关心保存和恢复的细节，直接调用管理者提供的统一 api 就可以，这样还可以复用更多需要撤销恢复的场景
- 弊端：保存大量的对象可能会出现内存泄漏

## 策略模式(Strategy)

- `对象-行为型`模式
- 把不同的策略代码封装成不同的类，然后通过`组合`的方式进行使用
- 角色
  - 策略类（多个）
  - 上下文类（用于存某一个策略）
- 好处
  - 针对不同的策略做出不同的行为
  - 可以改善 if-else 的语法

## 状态模式(State)

- 封装状态暴露行为，根据状态确定行为，并在状态类中完成状态的转换过程