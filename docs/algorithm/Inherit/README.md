# 继承

## 寄生组合式继承

```ts
function inheritPrototype(SubType, SuperType) {
  function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
  }
  const prototype = object(SuperType.prototype); // Object.create(SuperType.prototype);
  prototype.constructor = SubType;
  SubType.prototype = prototype;
}
function SuperType(a) {
  this.a = a;
}
SuperType.prototype.getName = function () {
  console.log(this.a);
};
function SubType(a, b) {
  SuperType.call(this, a);
  this.b = b;
}
inheritPrototype(SubType, SuperType);

console.log(new SubType(1, 2));
```
