[vue官方文档](https://react.docschina.org) 
[vue-cli官方文档](https://cli.vuejs.org) 
[10分钟快速精通rollup.js打包](https://www.imooc.com/article/264074)

## vue-cli2.0和3.0的对比分析
- `vue create` 是`vue-cli3.x`的初始化方式，目前模板是固定的，模板选项是可以自由配置的，具体配置参考[官方文档](https://cli.vuejs.org/zh/)
- `vue init` 是`vue-cli2.x`的初始化方式，可以使用github上的一些模板来初始化项目，webpack是官方推荐的标准模板
- 3.0建的项目用mini-css-extract-plugin代替extract-text-webpack-plugin。因为extract-text-webpack-plugin在webpack4.0+版本上运行有问题

## vue源码原理分析-观察者模式
[filename](../utils/Polyfill/vue/observer.js ':include')
