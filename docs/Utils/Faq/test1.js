'use strict';
var loop = function (arr, initTime, speed, maxTime) {
  return function (_startFn, _fn, _endFn) {
    var options = {
      initTime: initTime || 100,
      speed: speed || 100,
      maxTime: maxTime || 1000,
      _index: 0,
      _count: 0,
      checkFinish: null,
      _startFn: _startFn,
      _fn: _fn,
      _endFn: _endFn,
      arr: arr,
    };
    var iterator = function () {
      var t = this.initTime + this.speed * this._count;
      if (t < this.maxTime) this._count++;
      var that = this;
      setTimeout(function () {
        that._fn(that, that.arr[that._index]);
        that.checkFinish && that.checkFinish(that) ? that._endFn(that, that.arr[that._index]) : iterator.call(that)
        that._index = that._index >= that.arr.length - 1 ? 0 : that._index + 1;
      }, t);
    };
    _startFn(options, options.arr[options._index]);
    iterator.call(options);
  }
}
loop([1, 2, 3, 4, 5], 300, 50, 1000)(function (options, curValue) {
  /* 开始 */
  // 模拟异步调用返回
  setTimeout(function () {
    /* 动态赋值checkFinish并return true来结束循环 */
    options.checkFinish = function (options) {
      if (options._index === 4) return true;
      return false;
    }
  }, 5000);
}, function (options, curValue) {
  /* 每次循环 */
}, function (options, curValue) {
  /* 结束 */
});
