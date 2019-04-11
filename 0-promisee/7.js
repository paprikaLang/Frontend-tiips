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
  let handler = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handler.forEach(next);
    handler = [];
 
  }

  function reject(err) {
    state = REJECTED;
    value = err;
    handler.forEach(next);
    handler = [];

  }

  function resolve(result) {
    try {
      let then = typeof result.then == 'function' ? result.then : null;
      //如果上一个onFulfill(value) 返回的是promise, 执行这个result 的 this.then方法
      //再次获得onFulfill(value)的值 走到 这里就应该不是promise了,可以执行fulfill(result)
      if (then) {
        then.bind(result)(resolve,reject);
        return;
      }
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
        handler.push({onFulfill, onReject});
    }
  }

  this.then = function (onFulfill, onReject) {
    /*
then(val => {})的val是由promise的resolve(val)得来.
resolve是在全局更改value的.
onFulfill(value)得到的返回值又通过 resolve 传递给了下一个 onFulfill:(val) 
*/
    return new Promisee((resolve,reject) => {
      next({
        onFulfill:(val) => {
          resolve(onFulfill(val));
        }, 
        onReject: (err) => {
          reject(onReject(val));
        }
      });
    })
  }

  fn(resolve, reject);
}

function sleep(sec){
  return new Promisee((resolve,reject) => {
    setTimeout(() => resolve(sec), sec * 1000);
  });
}

let p = new Promisee((resolve, reject) => {
  resolve('tiyo');
  // setTimeout(() => reject('hello'),0);
});

 p.then((val) => {
  console.log(val);
  return sleep(2);
}).then(console.log);

//tiyo
//Promisee { then: [Function] } 

//return 返回的不止是字符串, 也有可能是Promise
// 通过 typeof result.then == function 来判断return的是不是promise.

//updated:
//tiyo
//2
