# 📚 motivation

- React is no more a `View` lib, it's now (v17) a complete framework: so either we pick a lighter lib for the `View`, or choosing React ❌ **we shouldn't need to use an additional external framework** such as Redux, MobX, RxJs, Recoil, Zustand, Jotail...

- A first approach could be to use local states and sporadic use of React context, like [explained here by Kent C. Dodds](https://kentcdodds.com/blog/application-state-management-with-react), but ❌ it's not a proper Flux implementation, I'd rather have **my entire app state fully separated from the `View`**, and "connect" [containers](https://medium.com/@learnreact/container-components-c0e67432e005), mapping sub-states to the views, the way Redux allows to.

- Using React context to propagate the global app state, like [suggested here by Rico Sta. Cruz](https://ricostacruz.com/til/state-management-with-react-hooks), [or here by Ebenezer Don](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/), would be ok for a _small application_, but would quickly lead to ❌ **tons of useless re-renderings**.

- That would eventually lead to lots of specific `useMemo` on every component requiring performance optimisation.
  So rather than to put the effort on developping on a proper state/component architecture, your effort will be spent on ❌ **writing those `useMemo` everywhere**.

- Eventually, all these steps lead me to `RxJs` which allows the use of **many stores**, by subscribing to their updates on `useEffect` and applying changes with `useState` I would have this **local rerendering** I want.
  ❌ Well, that would mean adding a third party lib, and I'd like not to.

- Finally, I've come accross [zustand](https://github.com/pmndrs/zustand), which resolves all these previous points and use React hooks only !

  - That is the lib **the closest** to the way I want to manage my state, but ❌ I want to keep my redux-like reducers, actions and container connect function to map my stores locally to the required props for the finest re-rendering, and no extra-recipes (back to point 1)

  - Try to instanciate twice your app with `zustand`: ❌ your stores are not scoped, you need to scope them manually. That's where a React context Provider is useful, and I chose to wrap my React app with a Provider to use many `La Taverne` in different apps in one single page.

- Now, experimenting with the first versions of La Taverne, I got quite early on the issue of calling **async functions** before to reduce a store state.
  Which is resolved by Redux:

  - [using a thunk middleware](https://github.com/reduxjs/redux-thunk#motivation), which is indeed a smart hack, but leads to overload again the Redux workflow with more opacity: ❌ you may dispatch Actions OR Thunks. If you go for thunks for async calls, a middleware will call them for you.

  - using `Redux saga` or `Redux Loop` ❌ a framework over the framework.

<p align="center"><img  height="280px"  src="./taverne.png"></p>

## The idea with `La Taverne` is

### stores

- ✅ to implement a simple [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview)
- ✅ **splitting** the global app state into **stores** states
- ✅ to `dispatch` actions for which stores will have `reactions`:
  - reduce this action immediately.
  - or perform a function before.

### taverne/hooks

provide an easy React integration

- ✅ to allow simple React integration with **hooks** and a **Context Provider** to access `{...props} = useMyStore()` anywhere,
- ✅ applying **local rendering**, by mapping these stores states to [containers](https://medium.com/@learnreact/container-components-c0e67432e005), using React hooks `useState` and `useEffect`.
- ✅ add `propsMapping` to update `props` only when there _is_ an update on this store, to provide even more accurate re-rendering.
