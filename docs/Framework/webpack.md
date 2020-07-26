['一文掌握Webpack编译流程'](https://blog.csdn.net/React_Community/article/details/107194743)

## 编译过程
- 初始化配置参数 合并配置文件和shell语句中的参数
- 开始编译 compiler.run 生成 compilation
- 编译模块 make阶段 1. 调用各种loaders进行编译，转换成js代码 2. acorn对js代码进行语法分析并收集依赖
- 输出资源 组装成一个个的chunk文件，调用seal进行封装，这步是可以修改输出内容的最后机会
- 完成输出 emit阶段，根据配置上的输出路径和文件名，把文件内容写入到文件系统中

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
      * 重置call、callAsync、promise三个函数
      * 在 _resetCompilation 方法内部把 call 方法的值重置成了 _call 方法，这是因为我们执行 call 方法时执行的是编译好的静态脚本，所以如果注册事件回调时不重置成 _call 方法，那么因为惰性函数的缘故，执行的静态脚本就不会包含当前注册的事件回调了
    - 通过options中的before和stage来确定当前tap注册的回调位置，并排序tap放入到taps数组里面
- ### 触发call
  * 在触发call的时候，是跑的lazyCompileHook函数，这个函数会调用_createCall
  * _createCall调用对应hook中的compile进行编译
  * compile中调用HookCodeFactory.setup把options上的taps放到this._x中
  * HookCodeFactory.create运用new Function组装代码
