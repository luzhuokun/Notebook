class Dep {
  constructor() {
    this.deps = new Set();
  }
  depend(key) {
    if (Dep.target) this.deps.add({
      key,
      target: Dep.target,
    });
  }
  notify(key) {
    this.deps.forEach((dep) => {
      if (dep.key === key) dep.target();
    });
  }
}
Dep.target = null;

class Observer {
  constructor(obj) {
    return this._createProxy(obj);
  }
  _createProxy(obj) {
    const dep = new Dep();
    const handler = {
      get(target, key, receiver) {
        dep.depend(key);
        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        dep.notify(key);
        return result;
      }
    };
    return new Proxy(obj, handler);
  }
}

class Watcher {
  constructor(obj, key, cb) {
    return this._defineComputed(obj, key, cb);
  }
  _defineComputed(obj, key, cb) {
    const handler = {
      get(target, key, receiver) {
        Dep.target = cb;
        const val = cb();
        Dep.target = null;
        return val;
      },
      set(target, key, value, receiver) {
        console.error('计算属性无法被赋值！')
      }
    };
    return new Proxy(obj, handler);
  }
}

var a = new Observer({
  l: [1, 2]
});

var b = new Watcher(a, 'q', function () {
  console.log('变化了');
  return a.l
});

console.log(b.q);
a.l.push(3);
