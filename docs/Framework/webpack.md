
## tapable原理分析
主要是控制钩子事件的订阅和发布，一个类似Node中的EventEmitter，webpack通过tapable将实现和流程解偶

- ### 实例化Hook
  * 同步钩子：
    - SyncHook （执行每一个，不关心函数返回）
    - SyncBailHook （顺序执行，遇到第一个结果result!==undefined则返回，不再继续执行）
    - SyncWaterfallHook （顺序执行，如果前一个Hook函数的结果作为后一个hook函数的第一个参数来使用，有点像Array.prototype.reduce的用法）
    - SyncLoopHook （不停循环执行hook，直到所有函数结果result===undefined）
  * 异步钩子：
    - AsyncParallelHook
    - AsyncParallelBailHook
    - AsyncSeriesHook
    - AsyncSeriesBailHook
    - AsyncSeriesWaterfallHook
  * 其他
    - HookMap
    - MultiHook
  * 样例
    - 同步用法：
    ```js
      const { SyncHook, SyncBailHook, SyncWaterfallHook } = require('tapable')
      const hook = new SyncHook(['arg1', 'arg2'])
      hook.tap('a', (arg1, arg2) => {
          console.log('a', arg1, arg2)
      })
      hook.tap('b', (arg1, arg2) => {
          console.log('b', arg1, arg2)
      })
      hook.call(1, 2)
    ```
    - 异步用法：
    ```js
      const { AsyncParallelHook, AsyncSeriesHook, AsyncSeriesWaterfallHook } = require('tapable')
      const hook = new AsyncSeriesWaterfallHook(['arg1', 'arg2'])
      hook.tapAsync('a', (arg1, arg2, cb) => {
          setTimeout(() => {
              console.log('a', arg1, arg2)
              cb()
          }, 2000);
      })
      hook.tapPromise('b', (arg1, arg2) => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  console.log('b', arg1, arg2)
                  resolve('qqq')
              }, 1000);
          })
      })
      hook.tapPromise('b', (arg1, arg2) => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  console.log('b', arg1, arg2)
                  resolve('ttt')
              }, 1000);
          })
      })
      /* 使用AsyncSeriesWaterfallHook时有个坑，tapAsync和tapPromise混用会有问题，最好还是tapAsync对应callAsync，tapPromise对应promise来使用 */
      hook.promise('arg1', 'arg2').then((a, b) => {
          console.log(a, b);
      });
    ```
- ### 挂载tap
  * Hook._runRegisterInterceptors 拦截器
  * Hook._insert 
    - _resetCompilation
      重置call、callAsync、promise三个函数
    - 通过options中的before和stage来确定当前tap注册的回调位置，并排序tap放入到taps数组里面
- ### 触发call
  * 在触发call的时候，是跑的lazyCompileHook函数，这个函数会调用_createCall
  * _createCall调用对应hook中的compile进行编译
  * compile中调用HookCodeFactory.setup把options上的taps放到this._x中
  * HookCodeFactory.create运用new Function组装代码
