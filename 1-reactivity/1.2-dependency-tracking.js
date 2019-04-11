/*
create a `dep` class with two methods: depend and notify
create an autorun function that takes an updater function
inside the updater func you can explicitly depend on an instance of dep by calling dep.depend()
later u can trigger the updater func to run again by calling dep.notify()

const dep = new Dep()
autorun(() => {
	dep.depend()
	console.log('updated')
})
// should log : updated

dep.notify()
//should log: updated again at anywhere
*/

class Dep {
	constructor() {
		this.subscribers = new Set()
	}
	depend() {
		if (activeUpdate) {
			//register the current active update as a subscriber
			this.subscribers.add(activeUpdate)
		}
	}
	notify() {
		// run all subscribers 
		this.subscribers.forEach(sub => sub())
	}
}



let activeUpdate;

function autorun(update) {
	function wrappedUpdate() {
		activeUpdate = wrappedUpdate
		update() //执行这句时 activeUpdate 不为 nil, 所以 wrappedUpdate 函数被保存了起来等待执行(就像 Promise 的 PENDING)
		activeUpdate = null
	}
	wrappedUpdate()
}


const dep = new Dep();

autorun(() => {
	dep.depend()
	console.log('updated')
})

dep.notify()

/*

let p = new Promise((resolve, reject) => {
	setTimeout(() => resolve('hello'), 0);
});

*/
