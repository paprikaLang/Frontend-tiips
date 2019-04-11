/*
combine the previous two funcs renaming `convert()` to `observe()` and keeping `autorun`:

observe() converts the props in the received obj and make them reactive. for each converted property,
it gets assigned a Dep instance which keeps track of a list of subscribing update funcs. and triggers them
to re-run when its setter is invoked.

autorun takes an update func and re-runs it when props that the update func subscribes to have been mutated.
an update fun is said to be subscribing to a prop if it relies on that prop during its evaluation 

const state = {
	count: 0
}
observe(state)
autorun(() => {
	console.log(state.count)
})
state.count++
*/


function observe(obj) {
	
	Object.keys(obj).forEach(key => {
		var subscribes = new Set()
		let internalValue = obj[key]
		Object.defineProperty(obj, key, {
			get() {
				if (activeUpdate) {
					subscribes.add(activeUpdate);
				}
				return internalValue
			},
			set(newValue) {
				internalValue = newValue
				subscribes.forEach(sub => sub())
			}
		})
	})
}

let activeUpdate;

function autorun(update) {
	function wrappedUpdate() {
		activeUpdate = wrappedUpdate
		update()
		activeUpdate = null
	}
	wrappedUpdate()
}

const state = {
	count: 0
}
observe(state)
autorun(() => {
	console.log(state.count)
})
autorun(() => {
	console.log(state.count)
})
state.count++
state.count++
state.count++