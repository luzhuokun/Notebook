!>
[vue官方文档](https://react.docschina.org)  
[vue-cli官方文档](https://cli.vuejs.org)  
[10分钟快速精通rollup.js打包](https://www.imooc.com/article/264074)  

## 一个组件在beforeMount和Mount之间干了什么
new Watcher -> vm._render(创建虚拟vnode) -> vm._update -> vm.__patch__(比较新旧vnode，diff算法的核心)

## vue-cli2.0和3.0的对比分析
- `vue create` 是`vue-cli3.x`的初始化方式，目前模板是固定的，模板选项是可以自由配置的，具体配置参考[官方文档](https://cli.vuejs.org/zh/)
- `vue init` 是`vue-cli2.x`的初始化方式，可以使用github上的一些模板来初始化项目，webpack是官方推荐的标准模板
- 3.0建的项目用mini-css-extract-plugin代替extract-text-webpack-plugin。因为extract-text-webpack-plugin在webpack4.0+版本上运行有问题

## vue源码原理分析-观察者模式
[filename](../utils/Polyfill/vue/observer.js ':include')

## vue-ssr

### nuxt
https://zh.nuxtjs.org/guide

### prerender
prerender-spa-plugin利用了puppeteer的爬取页面的功能。Puppeteer 是 Chrome 开发团队在 2017 年发布的一个 Node.js 包，用来模拟 Chrome 浏览器的运行。

### netlify

## vuepress
[中文文档](https://www.vuepress.cn/)

### vuepress的原理分析
markdown文件通过markdown-loader转换成vue，再通过vue-loader得到最终的html  
[深入浅出 vuepress](https://www.jianshu.com/p/c7b2966f9d3c)
