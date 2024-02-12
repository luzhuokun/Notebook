## Reflect Metadata

- npm install reflect-metadata
- tsconfig 配置 `experimentalDecorators` 和 `emitDecoratorMetadata`
- 配置 emitDecoratorMetadata 自动添加 `design:type`、`design:paramtypes`、`design:returntype` 元数据，分别获取属性类型、函数参数类型、函数返回值类型
- Reflect.getMetadata("design:type", target, key)
- Reflect.getMetadata("design:paramtypes", target, key) 获取函数参数类型
- Reflect.getMetadata("design:returntype", target, key) 获取函数返回值类型

### Reflect.defineMetadata

- Reflect.defineMetadata(key, value, target)
- Reflect.defineMetadata(key, value, C.Prototype, "method")

### Reflect.getMetadata

- Reflect.getMetadata(key, target, propertyKey)

### Reflect.metadata

- @Reflect.metadata(key, value)

## 依赖注入（DI）

- 实现控制反转的一种方式

## 控制反转（IOC）

- 自动扫描依赖（在 Module 中定义依赖让 nest 扫描）
- `自动创建实例`
- 自动注入（Reflect.metadata）
- 好处：代码解耦

## 谈谈对 nest 的理解

- nest 是一个`企业级 node 框架`，提供`强大的架构设计`，提供了依赖注入、控制反转（IOC）、面向切面编程（AOP）等特性
- `支持 TS`，`社区支持度很高`，npm 下载量很大
  - 提供`依赖注入`，借助 ts 的`装饰器模式`和 `Reflect.metadata` 的能力实现 `IOC 机制`，让代码更易于维护。
  - 不需要手动创建实例，`自动扫描`需要加载的类，并`自动实例化`放到容器中，实例化时通过类的构造函数的参数`自动注入`进去
- nest 底层基于 express ，nest 解决 express 过于简单灵活，导致项目规模过大时难以维护的问题
- nestjs 用起来像 angular，像 java 的 springBoot，有很多抽象的概念，刚开始上手可能有一定的上手难度，但熟悉了以后这种设计更容易做大型项目维护

[nest 实现原理](https://zhuanlan.zhihu.com/p/546947975)
