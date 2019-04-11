'use strict';

const PENDING = Symbol();
const FULFILLED = Symbol();
const REJECTED = Symbol();

function Promisee(fn) {
  if (typeof fn != 'function') {
    throw new Error('resolver should be a function!');
  }

  let state = PENDING;
  let value = null;

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(err) {
    state = REJECTED;
    value = err;
  }

  function resolve(result) {
    try {
      fulfill(result);
    }catch(err){
      reject(err);
    }
  }
  this.then = function (onFulfill, onReject) {
    switch (state) {
      case FULFILLED:
        onFulfill(value);
        break;
      case REJECTED:
        onReject(value);
        break;
    }
  }

  fn(resolve, reject);
}

let p = new Promisee((resolve, reject) => {
  reject('hello');
});

p.then(console.log.bind(null, 'over'), console.error.bind(null, 'error'));

/*
let p = new Promisee((resolve, reject) =>  带了两个函数参数
resolve和reject都是Promisee内部的函数.执行任意一个如reject('hello'); 
全局变量state和value的值都会相应改变.

this.then = function (onFulfill, onReject) 也带了两个函数参数
onFulfill和onReject会根据上面state的改变和value的值决定执行哪个

*/









