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
  let handler = {};

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handler.onFulfill(result);
  }

  function reject(err) {
    state = REJECTED;
    value = err;
    handler.onReject(err);
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
        onFulfill && onFulfill(value);
        break;
      case REJECTED:
        onReject && onReject(value);
        break;
      case PENDING:
        handler = {onFulfill, onReject};
    }
  }

  fn(resolve, reject);
}

let p = new Promisee((resolve, reject) => {
  // resolve('hello');
  setTimeout(() => resolve('hello'),0);
});

p.then(console.log.bind(null, 'over'), console.error.bind(null, 'error'));

/*
Promise 本身就是解决异步的问题, 如果setTimeout(() => reject('hello'));让reject或resolve延后执行
根据1.js的解释, p.then 的 onFulfill 和 onReject 无法根据value和state的值来决定如何执行了.
所以要保证 onFulfill 在 resolve("hello")之后进行. 用 handler hold 住, 在执行setTimeout(() => resolve('hello'),0);时,
resolve并未执行, 所以state=PENDING, 当执行到then时switch将handler赋值.最后当执行到resolve时, handler里的onFulfill和onReject就可以在switch中执行了.


*/













