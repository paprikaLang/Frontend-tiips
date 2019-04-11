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
onFulfill(value)得到的值又通过下一个 Promise 的 resolve 传递给了下一个 onFulfill:(val) 
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

let p = new Promisee((resolve, reject) => {
  resolve('tiyo');
  // setTimeout(() => reject('hello'),0);
});

p.then((val) => {
  console.log(val);
  return 'hello';
})
p.then((val) => {
  console.log(val);
  return 'world';
})
let q = p.then((val) => {
  console.log(val);
  return 'paprikaLang';
})
q.then(console.log);


