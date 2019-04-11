
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
    // handler.onFulfill(result);
    next(handler);
 
  }

  function reject(err) {
    state = REJECTED;
    value = err;
    // handler.onReject(err);
    next(handler);

  }

  function resolve(result) {
    try {
      fulfill(result);
    }catch(err){
      reject(err);
    }
  }
  function next({onFulfill, onReject}) {
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

  this.then = function (onFulfill, onReject) {
    next({onFulfill, onReject});
  }

  fn(resolve, reject);
}

let p = new Promisee((resolve, reject) => {
  resolve('hello');
  // setTimeout(() => reject('hello'),0);
});

// p.then(console.log.bind(null, 'over'), console.error.bind(null, 'error'));
p.then(val => {
	console.log(val);
})

/*
handler.onReject is not a function.
原因是, 在Promisee执行完非异步的resolve('hello');之后不会给handler赋值.所以在fulfill方法中 handler.onFulfill(result);是不认识的.
由于then的参数必须是handler的两个参数onFulfill, onReject, 可以利用析构语法next(handler) <=>next({onFulfill, onReject})作为桥梁.
将switch代码抽离出来.

*/