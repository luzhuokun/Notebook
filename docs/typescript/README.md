[官方文档](https://www.tslang.cn/docs/home.html)
[TypeScript 高频面试题汇总](https://developer.aliyun.com/article/1067624)

## 介绍一下 typescript

- typescript 是 js 的`超集`，完全`兼容` js 语法并对 js 做了`增强`，如添加了枚举、接口、泛型等
- typescript 还是一个`类型系统`，提供了`静态类型检查`，增强代码可维护性

### 特点

- 跨平台支持
- js 超集，增强
- 静态类型检查
- 提供面向对象的功能，如类、接口、泛型

## type 和 interface 的区别

- type 用来定义`复杂类型`（基本类型、联合类型、交叉类型、元组等），interface 定义对象和函数的形状（不支持基本类型）
- type 不支持`重复声明（声明合并）`，interface 支持重复声明（声明合并）但不能出现相同属性（类通过 implements 实现接口）
- type 可以通过交叉类型(&)来`继承`扩展属性，interface 通过 extends 继承

### 什么时候用 type，什么时候用 interface

- 官方建议：优先使用 interface，其他无法满足需求的情况下用 type（复杂类型的场景）
- 针对不同的场景来区分
  - 如果想`保持代码统一`，应该选择使用 type。类型别名其实可涵盖 interface 的大部分场景
  - 如果是在库或第三方类型定义中的公共 API 定义，应使用 interface 来提供声明合并功能

## 介绍一下类型守卫、联合类型和交叉类型的区别

- 类型守卫(in、typeof、instanceof)
  - 代码运行时加的一层判断
- 联合类型(|)
  - 将变量设置成多种类型，赋值时至少满足其中一个就可以
  - 联合类型的值在还没确定的情况下，只能访问共有的属性，不然会报错
- 交叉类型(&)
  - 将多个类型合并成一个类型
  - 不同的原子类型合并会变成 never
  - 交叉类型的值需要定义合并类型中的每个成员

## never 和 void 区别

- never 表示一个永远不存在的值，可以被赋值为 null 和 undefined
- void 表示没有任何类型，常用于函数返回
- 在函数的使用场景下，返回 void 类型表示函数能正常运行，返回 never 表示函数无法正常返回，会出现运行报错

## any 和 unknown 的区别

- unknown 表示类型不确定，any 表示完全不做类型检查
- unknown 只能被赋值给 unknown 和 any 类型的变量，某些场景下比 any 更安全
- unknown 不允许访问属性，不允许赋值给其他有明确类型的变量

## 解释一下类型保护

- 类型断言
- in
- typeof
- instanceof

## 访问修饰符有哪些

- public
- private
- protected
- 用在类成员定义上

## extends 用法

- 接口继承
- 条件判断
  - 普通用法
    - 如果 extends 前面的类型能够赋值给 extends 后面的类型，那么表达式判断为真，否则为假。
  - 泛型用法
    - 如果传入的是`联合类型`，则使用`分配律`计算最终的结果，走`分配条件类型`逻辑
      - 分配律指的是将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。
- 类型约束

## 谈谈对 infer 的理解

- 在 extends 条件语句中推断类型，可以用于推断函数的返回值类型

## 介绍一下元组

- 可以指定个数和类型的特殊数组
- 一般情况下，数组的定义下类型只能指定一个，元组则可以指定多个

## 介绍一下枚举

- 枚举是一个键值对集合，键只支持字符串形式，值支持数字、字符串
- 包括` 数字枚举``字符串枚举 `和`常量枚举`
- 数字枚举存在反向映射，通过 key 能访问到数值，同时通过数值也能访问到对应的 key 值
- 数字枚举和字符串枚举也可以混合使用
- 常量枚举（const enum），唯一区别是在`编译阶段被删除`，并且不能包含计算成员

### 跟直接 const 定义枚举值有什么优势

- 数字枚举提供了`自动生成数值`和`反向映射`，在某些场景下，使用会更方便
- `编译优化`，使用常量枚举时，在编译会直接转换成具体的值，从而提升运行性能

## 介绍一下泛型

- 泛型是指在定义函数、接口、类的时候，可以`事先不预设`指定的类型，而`使用时再指定`具体的类型，提高类型代码的复用性和维护性
- 在 ts 中使用尖括号<>定义`泛型变量`（泛型参数）
- 在函数、类、接口中通过泛型变量帮助我们`捕获用户传入的类型`
- 在使用函数、类、接口时，可以不需要明确传入类型，通过`类型推导`自动帮我们确定泛型变量的类型
- 针对泛型变量还可以设置`泛型约束`，通过 extends 关键字`限制`类型变量的`类型`，从而提高安全性
- 使用泛型可以`复用`一些具有相同类型结构的代码（定义具有相同结构但不同类型属性的对象或函数），提高代码的复用性和可维护性

```ts
// 泛型函数
function identify<T extends number>(arr: T[]): T {}
// 泛型类
class MyClass<T extends number> {
  constructor(public value: T) {}
}
// 泛型接口
interface CreateObject<T extends number> {
  (properties: T): { [P in keyof T]: T[P] };
}
```

## 内置工具类型

- `Extract`
  - 判断是不是子类，判断继承关系
  - 如果 T 是一个联合类型（通过|组合），extends 左边的值会逐一匹配 U 判断是否符合
  ```ts
  type Extract<T, U> = T extends U ? T : never;
  ```
- `Exclude`
  - 判断不是子类则返回 T，用法与 Extract 相反
  ```ts
  type Exclude<T, U> = T extends U ? never : T;
  ```
- `Pick`
  - 从 T 对象类型中取出一系列 K 的属性，返回一个对象类型
  ```ts
  function Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  ```
- `Omit`
  - 返回除了指定的某些属性外的类型
  ```ts
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
  ```
- `Required`
  - 所有属性必填
  ```ts
  type Required<T> = {
    [k in keyof T]-?: T[k];
  };
  ```
- `Partial`
  - 所有属性可选
  ```ts
  type Partial<T> = {
    [k in keyof T]?: T[k];
  };
  ```
- `Readonly`
  - 所有属性只读
  ```ts
  type Readonly<T> = {
    readonly [k in keyof T]: T[k];
  };
  ```
- `Record`
  - 所有属性赋同一个类型
  ```ts
  type Record<K extends string | number | symbol, T> = {
    [P in K]: T;
  };
  ```

## 命名空间和模块的区别

- 命名空间和模块都是一种`组织代码的方式`
- 命名空间是通过 namespace 关键字，解决全局作用域下`命名冲突`的问题
- 模块一般以`文件` import、export 导入导出的方式实现代码管理
- 目前以模块的方式来管理代码（TS 推荐），命名空间现在很少看到有人在项目中使用，在类型定义文件中看到过

[TypeScript 中的模块与命名空间](https://blog.csdn.net/jieyucx/article/details/131498608)

## 类型映射

- 将一种类型按照映射规则，转换成另一种类型，通常用于对象类型
- 主要用于两个类型的属性结构是一样的，但是属性的类型不一样

```ts
type A = {
  foo: number;
  bar: number;
};

type B = {
  [prop in keyof A]: string;
};
```
