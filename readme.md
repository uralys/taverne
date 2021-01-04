# ⛵ hookstores <a href="https://www.npmjs.com/package/@uralys/hookstores"><img src="https://img.shields.io/npm/v/@uralys/hookstores?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/@uralys/hookstores"><img src="https://img.shields.io/badge/status-experimental-127712.svg" alt="Experimental solution." /> </a>

`Hookstores` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation using React hooks.

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

---

## 📚 motivation

- React is no more a `View` lib, it's now (v17) a complete framework: so either we pick a lighter lib for the `View`, or choosing React ❌ **we shouldn't need to use an additional external framework** such as Redux, MobX, RxJs, Recoil, Jotail...

- A first approach could be to use local states and sporadic use of React context, like [explained here by Kent C. Dodds](https://kentcdodds.com/blog/application-state-management-with-react), but ❌ it's not a proper Flux implementation, I'd rather have **my entire app state fully separated from the `View`**, and "connect" [containers](https://medium.com/@learnreact/container-components-c0e67432e005), mapping sub-states to the views, the way Redux allows to.

- Using React context for a global app state, like [suggested here by Rico Sta. Cruz](https://ricostacruz.com/til/state-management-with-react-hooks), [or here by Ebenezer Don](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/), would be ok for a _small application_, but would quickly lead to ❌ **tons of useless re-renderings**.
  That would eventually lead to lots of specific `useMemo` on every component requiring performance optimisation.
  So rather than to put the effort on developping on a proper state/component architecture, your effort will be spent on ❌ **writing those `useMemo` everywhere**.

## 🧙 experimentation

The idea with `hookstores` is to implement a simple [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview)

- ✅ **splitting** the the global state into **stores**,
- ✅ applying **local rendering**, by mapping these stores to [containers](https://medium.com/@learnreact/container-components-c0e67432e005), using React hooks `useState` and `useEffect`.
- ✅ using React context only to provide the `Dispatcher` everywhere, and `StoresProvider` who is emitting events to listeners of specific stores only.

## ☢️ disclaimer

So yes, somehow it ends up as another lib to manage your React state 🙃.

But since it's only few files you should understand what's behind the hood, then use and tweak them to your convenience _within your own React app_ rather than use it out of the box.

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
> npm i --save @uralys/hookstores
```

---

## setup

use `Dispatcher` and `StoresProvider` context providers to compose your root `<App/>`

```js
import {Dispatcher, StoresProvider} from '@uralys/hookstores';
```

```html
<Dispatcher>
  <StoresProvider>
    <App />
  </StoresProvider>
</Dispatcher>
```

---

## usage

In the following, let's illustrate how to use hookstores with a store of `Items`, with a fetch function, a `container` plugged to this store, and the `component` rendering the list of items.

---

### prepare descriptions

Describe all your stores:

- you should use one store for one feature (here the `items`)
- define within `computeAction` how a store must update its state for every `handledAction`:

```js
/* ./features/items/store-description.js */
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
  name: 'itemsStore',
  initialState: {items: null},
  handledActions: [FETCH_ITEMS],
  computeAction
};

export default itemsStoreDescription;
export {FETCH_ITEMS};
```

---

### create stores

1 - First thing the `<App>` has to do is to instanciate all stores.

They will be registered and will listen to all `dispatched` actions through the `Dispatcher`.

2 - Compose your containers with every store you need

Then, everytime they compute an action and update their state, they notify all connected containers.

```js
import {useStores, withStore} from '@uralys/hookstores';
import itemsStoreDescription from './features/items/store-description';

const storesDescriptions = [itemsStoreDescription];
const {createStores} = useStores();

const App = () => {
  const {createStores} = useStores();
  createStores(storesDescriptions);

  const ItemsWithStores = withStore(itemsStoreDescription)(ItemsContainer);

  return <ItemsWithStores />;
};
```

---

### apply state changes to components props

use `connectStore` to register to store changes on component mounting.

```js
import React, {useLayoutEffect, useState} from 'react';
import ItemsComponent from './component';

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

🔍 don't forget to return the `disconnect` function at the end of your hook, unless you may have stores updates triggering unmounted containers updates.

---

### dispatch actions from containers

use [`prop drilling`](https://kentcdodds.com/blog/prop-drilling) from your containers to your components: pass functions dispatching the actions

```js
import {SELECT_ITEM} from 'path/to/actions';

const ItemsContainer = props => {
  const {dispatch} = useDispatcher();

  const selectItem = id => () => {
    dispatch({
      type: SELECT_ITEM,
      itemId: id
    });
  };

  return <ItemsComponent selectItem={selectItem} {...componentProps} />;
};
```

---

## 🏗️ development

local dev [tips](dev.md)
