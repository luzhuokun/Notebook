"use strict";

/** 数组内元素逐一执行同一个异步函数 */
const asyncFn = (x) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x + 1);
    }, 1);
  });

const main = (arr) =>
  arr
    .reduce((p, value) => {
      return p.then((r) => {
        return asyncFn(r + value);
      });
    }, Promise.resolve(0))
    .then((res) => {
      console.log(res);
    });

main([1, 2, 3, 4]);
