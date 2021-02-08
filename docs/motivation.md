## 📚 motivation

- React is no more a `View` lib, it's now (v17) a complete framework: so either we pick a lighter lib for the `View`, or choosing React ❌ **we shouldn't need to use an additional external framework** such as Redux, MobX, RxJs, Recoil, Zustand, Jotail...

- A first approach could be to use local states and sporadic use of React context, like [explained here by Kent C. Dodds](https://kentcdodds.com/blog/application-state-management-with-react), but ❌ it's not a proper Flux implementation, I'd rather have **my entire app state fully separated from the `View`**, and "connect" [containers](https://medium.com/@learnreact/container-components-c0e67432e005), mapping sub-states to the views, the way Redux allows to.

- Using React context to propagate the global app state, like [suggested here by Rico Sta. Cruz](https://ricostacruz.com/til/state-management-with-react-hooks), [or here by Ebenezer Don](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/), would be ok for a _small application_, but would quickly lead to ❌ **tons of useless re-renderings**.

- That would eventually lead to lots of specific `useMemo` on every component requiring performance optimisation.
  So rather than to put the effort on developping on a proper state/component architecture, your effort will be spent on ❌ **writing those `useMemo` everywhere**.

- Eventually, all these steps lead me to `RxJs` which allows the use of **many stores**, by subscribing to their updates on `useEffect` and applying changes with `useState` I would have this **local rerendering** I want.
  ❌ Well, that would mean adding a third party lib, and I'd like not to.

- Finally, I've come accross [zustand](https://github.com/pmndrs/zustand), which resolves all these previous points and use React hooks only !
  That is the lib **the closest** to the way I want to manage my state, but ❌ I want to keep my redux-like reducers, actions and container connect function to map my stores locally to the required props for the finest re-rendering, and no extra-recipes (back to point 1)

## 🧙 experimentation

The idea with `Hookstores` is

- ✅ to stay within React **only**,
- ✅ to implement a simple [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview)
- ✅ **splitting** the global app state into **stores** states,
- ✅ applying **local rendering**, by mapping these stores states to [containers](https://medium.com/@learnreact/container-components-c0e67432e005), using React hooks `useState` and `useEffect`.
- ✅ creating the stores on app startup, then using React hooks to access `{props} = useStore('myStore', propsMapping)` anywhere, with the dedicated "storeState to props", only updated when there _is_ an update on this store: Now that's local re-rendering.
- ✅ unsing `dispatch` to emit actions to every store, and they now if they have to compute this action to reduce a new state.

## ☢️ disclaimer

So yes, somehow it ends up as another lib to manage your React state 🙃.

But since it's only few files you should understand what's behind the hood, then use and tweak them to your convenience _within your own React app_ rather than use it out of the box.

You'll see `Hookstores` is rather few lines to **patch** React.

Furthermore,

- ⚠️ it's not written in typescript 🙀
- ⚠️ there are no tests 💥

That being said,

- ✅ I'm confidently using this implementation between many apps,
- ✅ so I prefer to have this package,
- ✅ so why not sharing this experiment.
