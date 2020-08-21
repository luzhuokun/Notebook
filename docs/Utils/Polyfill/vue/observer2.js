
class Dep {
  constructor() {
    this.deps = new Set();
  }
  depend() {
    if (Dep.target) this.deps.add(Dep.target);
  }
  notify() {
    this.deps.forEach((dep) => dep());
  }
}
Dep.target = null;

class Observer {
  constructor(obj) {
    this.walk(obj);
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key])
    });
  }
  defineReactive(obj, key, value) {
    const dep = new Dep();
    if (Array.isArray(obj[key])) {
      Object.defineProperty(obj[key], 'push', {
        value() {
          this[this.length] = arguments[0];
          dep.notify();
        }
      });
      Object.defineProperty(obj, key, {
        get() {
          dep.depend();
          return value;
        }
      });
    } else {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
          dep.depend();
          return value;
        },
        set(val) {
          value = val;
          dep.notify();
        }
      });
    }
  }
}

class Watcher {
  constructor(obj, key, cb) {
    this.defineComputed(obj, key, cb);
  }
  defineComputed(obj, key, cb) {
    Object.defineProperty(obj, key, {
      get() {
        Dep.target = cb;
        const val = cb();
        Dep.target = null;
        return val;
      },
      set() {
        console.error('计算属性无法被赋值！');
      }
    });
  }
}

var o = {
  a: 111,
  b: 222,
  c: 333,
  d: [123, 456]
};

new Observer(o);

new Watcher(o, 'qqq', () => {
  let val = o.a + o.b;
  console.log('computed:' + val);
  return val
});

console.log(o.qqq);
o.a = 444;
o.b = 444;
o.c = 444;
o.d.push(789);
