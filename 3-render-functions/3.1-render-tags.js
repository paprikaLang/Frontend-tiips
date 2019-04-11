/*
initial render
template
-> (compiled into) render function
-> (returns) virtual dom
-> (generates) actual dom

subsequent updates
render function
->(returns) new virtual dom
->(diffed against old virtual dom) dom update
->(applied to) actual dom

actual dom: document.createElement('div') [object HTNLDivElement]
virtual dom: vm.$createElement('div') {tag:'div', data: {attrs: {}, ...}, children: []}
             plain js object (which is cheap)
            1. a lightweight js data format to represent waht the actual dom should look like at a given point in time
            2. decouples rendering logic from the actual dom enables rendering capabilities in non-browser env, 
               e.g. server-side and native mobile rendering.
render function: a func that returns virtual dom 
template -> [compiler] -> render func

import Component from '...'
h(Component, {
	props: { ... }
})

impl a `withAvatarURL` helper which takes an inner component that expects a url prop, and
return a higher-order component that accepts a `username` prop instead. 
the higher-order component should be responsible for fetching the corresponding avatar url from a mocked API.
Before the api returns the higher-order component should be passing a placeholder URL `http://via.placeholder.com/200x200`
to the inner component.
the exercise provides a base `avatar` component. the usage should look like this
const SmartAvatar = withAvatarURL(Avatar)
*/