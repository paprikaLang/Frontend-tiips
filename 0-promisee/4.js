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
    /*
      如果.then对应的onFulfill,在下一个.then之前已经执行完了, 下一个then还能捕获val值吗?
    */
    next({onFulfill, onReject});
    return new Promisee((resolve,reject) => {

    })
  }

  fn(resolve, reject);
}

let p = new Promisee((resolve, reject) => {
  resolve('tiyo');
  // setTimeout(() => reject('hello'),0);
});
// p.then(console.log.bind(null, 'over'), console.error.bind(null, 'error'));
p.then((val) => {
  console.log(val);
  return 'hello';
}).then((val) => {
  console.log(val);
  return 'world';
}).then((val) => {
  console.log(val);
})







