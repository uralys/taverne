# ⛵ hookstores <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/npm/v/hookstores?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/badge/-experimental-5908d2.svg" alt="Experimental solution." /> </a>

[![peerDeps](https://david-dm.org/uralys/hookstores/peer-status.svg)](https://david-dm.org/uralys/hookstores?type=peer)
[![devDeps](https://david-dm.org/uralys/hookstores/dev-status.svg)](https://david-dm.org/uralys/hookstores?type=dev)
[![deps](https://david-dm.org/uralys/hookstores/status.svg)](https://david-dm.org/uralys/hookstores)

`Hookstores` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation using React hooks and context.

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

---

## 📚 motivation

- React is no more a `View` lib, it's now (v17) a complete framework: so either we pick a lighter lib for the `View`, or choosing React ❌ **we shouldn't need to use an additional external framework** such as Redux, MobX, RxJs, Recoil, Jotail...

- A first approach could be to use local states and sporadic use of React context, like [explained here by Kent C. Dodds](https://kentcdodds.com/blog/application-state-management-with-react), but ❌ it's not a proper Flux implementation, I'd rather have **my entire app state fully separated from the `View`**, and "connect" [containers](https://medium.com/@learnreact/container-components-c0e67432e005), mapping sub-states to the views, the way Redux allows to.

- Using React context to propagate the global app state, like [suggested here by Rico Sta. Cruz](https://ricostacruz.com/til/state-management-with-react-hooks), [or here by Ebenezer Don](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/), would be ok for a _small application_, but would quickly lead to ❌ **tons of useless re-renderings**.

- That would eventually lead to lots of specific `useMemo` on every component requiring performance optimisation.
  So rather than to put the effort on developping on a proper state/component architecture, your effort will be spent on ❌ **writing those `useMemo` everywhere**.

- Eventually, all these steps lead me to `RxJs` which allows the use of **many stores**, by subscribing to their updates on `useEffect` and applying changes with `useState` I would have this **local rerendering** I want.
  ❌ Well, that would mean adding a third party lib, and I'd like not to.

## 🧙 experimentation

The idea with `Hookstores` is

- ✅ to stay within React **only**,
- ✅ to implement a simple [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview)
- ✅ **splitting** the global app state into **stores** states,
- ✅ applying **local rendering**, by mapping these stores states to [containers](https://medium.com/@learnreact/container-components-c0e67432e005), using React hooks `useState` and `useEffect`.
- ✅ using React context only to provide `Hookstores` with `{dispatch, ...stores}` everywhere,

  - `dispatch` allowing to emit actions to every store, and they now if they have to compute this action to reduce a new state.

  - your `stores` are accessible, with the `key` you give in `descriptions`, to allow kind of "mapStateToProps" on the connected containers, only when there _is_ an update: Now that's local re-rendering.

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

---

## 📦 installation

```sh
> npm i --save hookstores
```

---

## 🛠 setup

Under the hood, the `Hookstores` uses [React Context](https://reactjs.org/docs/context.html).

As such, you can wrap your root component, such as `App`, with the provider called `Hookstores` for convenience, to integrate it with your React app.

```jsx
<Hookstores>
  <App />
</Hookstores>
```

---

In the following, let's illustrate how to use `Hookstores` with:

- a store of `Items` and its fetch function
- a `container` plugged to this store,
- and the `component` rendering the list of items.

---

## ✍️ descriptions

`Hookstores` will create stores, register for actions, and emit updates using the descriptions you provide.

Each store has its own description, which must export:

- an `initialState`,
- a list of `handledActions`, from which this store needs to update its state.
- a function `computeAction`, computing a new store state as a reaction to each action.

```js
const itemsStoreDescription = {
  initialState: {},
  handledActions: [],
  computeAction: () => ({})
};

export default itemsStoreDescription;
```

🔍 When describing a store:

- you should use one store for one feature (here the `Items`)
- define within `computeAction` how a store must update its state for every `handledAction`.

![computeAction](https://user-images.githubusercontent.com/910636/103582817-e2d13600-4ede-11eb-8fbf-f0eb2a7cd3e7.png)

Here is the example for our illustrating `itemsStore`:

```js
/* ./features/items/store-description.js */
import fetchItems from './fetch-items.js';

const FETCH_ITEMS = 'FETCH_ITEMS';

const computeAction = async (currentState, action) => {
  let newState;

  switch (action.type) {
    case FETCH_ITEMS: {
      const items = await fetchItems();
      newState = {...currentState, items};
      break;
    }
    default:
      newState = {...currentState};
  }

  return newState;
};

const itemsStoreDescription = {
  initialState: {items: null},
  handledActions: [FETCH_ITEMS],
  computeAction
};

export default itemsStoreDescription;
export {FETCH_ITEMS};
```

---

## 🛠 back to setup

Once all descriptions are ready, you give them names, and pass them as parameters to `<Hookstores>`

```js
/* ./index.js */

import itemsStore from './features/items/store-description.js';
import anyOtherStore from './features/whatever/store-description.js';

<Hookstores
  descriptions={{
    quizzesStore,
    anyOtherStore
  }}
>
  <App />
</Hookstores>;
```

---

## storeState ➡️ props

Use `connectStore` to register your container to store changes.

Then map the store state to your component props, using your container state.

```js
/* ./features/items/container.js */

import React, {useLayoutEffect, useState} from 'react';
import ItemsComponent from './component';
import {connectStore} from 'hookstores';

const ItemsContainer = props => {
  const [items, setItems] = useState();
  const {itemsStore} = props;

  useLayoutEffect(() => {
    const onStoreUpdate = storeState => {
      setItems(storeState.items);
    };

    const disconnect = connectStore(itemsStore, onStoreUpdate);

    return disconnect;
  }, []);

  return <ItemsComponent items={items} />;
};
```

🔍 Don't forget to return the `disconnect` function at the end of your hook, unless you will have stores updates triggering unmounted containers updates.

---

## 📡 dispatching actions

Use [`prop drilling`](https://kentcdodds.com/blog/prop-drilling) from your containers to your components: pass functions dispatching the actions

```js
import {useHookstores} from 'hookstores';
import {SELECT_ITEM} from 'path/to/actions';

const ItemsContainer = props => {
  const {dispatch} = useHookstores();

  const selectItem = id => () => {
    dispatch({
      type: SELECT_ITEM,
      itemId: id
    });
  };

  return <ItemsComponent selectItem={selectItem} />;
};
```

---

## ➕ Advanced

You can use `store.getState()` to get any current store state and act depending on it.

For example, in this example we fetch the items on container mounting, if they are not already fetched:

```js
/* ./features/items/container.js */

const {itemsStore} = props;

useLayoutEffect(() => {
  const currentStoreState = itemsStore.getState();
  if (!itemsStore.items) {
    dispatch({type: FETCH_ITEMS});
  }
}, []);
```

---

## 🏗️ development

local dev [tips](dev.md)
