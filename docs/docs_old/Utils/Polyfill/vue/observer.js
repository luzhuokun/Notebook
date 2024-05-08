// Watcher Observer Dep

class Observer {
  constructor(obj) {
    return this.walk(obj);
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      this.defineReactive(obj, key, obj[key]);
    });
    return obj;
  }
  defineReactive(obj, key, val) {
    const dep = new Dep();
    if (Array.isArray(obj[key])) {
      Object.defineProperty(obj, "push", {
        value() {
          this[this.length] = arguments[0];
          dep.notify();
        },
      });
      Object.defineProperty(obj, key, {
        get() {
          dep.depend();
          return val;
        },
      });
    } else {
      Object.defineProperty(obj, key, {
        get() {
          dep.depend();
          return val;
        },
        set(newVal) {
          val = newVal;
          dep.notify();
        },
      });
    }
  }
}
class Watcher {
  constructor(obj, key, cb, onComputedUpdate) {
    this.obj = obj;
    this.key = key;
    this.cb = cb;
    this.onComputedUpdate = onComputedUpdate;
    return this.defineComputed();
  }
  defineComputed() {
    const self = this;
    const onDepUpdated = () => {
      const val = self.cb();
      this.onComputedUpdate(val);
    };
    Object.defineProperty(self.obj, self.key, {
      get() {
        Dep.target = onDepUpdated;
        const val = self.cb();
        Dep.target = null;
        return val;
      },
      set() {
        console.error("计算属性无法被赋值！");
      },
    });
  }
}
class Dep {
  constructor() {
    this.deps = new Set();
  }
  depend() {
    if (Dep.target) {
      this.deps.add(Dep.target);
    }
  }
  notify() {
    this.deps.forEach((dep) => {
      dep();
    });
  }
}
Dep.target = null;

const s = new Observer({
  a: "aaa",
  b: 111,
  c: "ddd",
});

new Watcher(
  s,
  "q",
  () => {
    return s.a + s.c;
  },
  (val) => {
    console.log("ttt", val);
  }
);

console.log(s.q);
s.a = "bbb";
s.b = "qqq";
s.c = "eee";
