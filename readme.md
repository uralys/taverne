# ⛵ hookstores <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/npm/v/hookstores?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/badge/-experimental-5908d2.svg" alt="Experimental solution." /> </a>

[![peerDeps](https://david-dm.org/uralys/hookstores/peer-status.svg)](https://david-dm.org/uralys/hookstores?type=peer)
[![devDeps](https://david-dm.org/uralys/hookstores/dev-status.svg)](https://david-dm.org/uralys/hookstores?type=dev)
[![deps](https://david-dm.org/uralys/hookstores/status.svg)](https://david-dm.org/uralys/hookstores)

`Hookstores` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation using React hooks.

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

---

## 🎨 idea

On every store update, specific props will be extracted for the components, and nothing else: this will allow accurate local rendering from a global app state.

```js
const propsMapping = {
  items: 'path.to.items.within.your.store',
  other: 'plop'
};

const ItemsContainer = props => {
  const {items} = useStore('itemsStore', propsMapping);
  return <ItemsComponent items={items} other={other} />;
};
```

## 📚 motivation

read this [doc](docs/motivation.md)

## 📦 installation

```sh
> npm i --save hookstores
```

## 🛠 setup

Here is the path to follow to setup Hookstores on your app:

- 1: write descriptions: your redux-like reducers
- 2: create stores on startup
- 3: bind store data to your container state
- 4: dispatch actions to trigger stores changes

---

In the following, let's illustrate how to use `Hookstores` with:

- a store of `Items` and its fetch function
- a `container` plugged to this store,
- and the `component` rendering the list of items.

---

## 1 ✍️ descriptions

`Hookstores` will create stores, register for actions, and emit updates using the descriptions you provide.

![computeAction](https://user-images.githubusercontent.com/910636/103582817-e2d13600-4ede-11eb-8fbf-f0eb2a7cd3e7.png)

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

<details>
<summary>Example</summary>

Here is the example for our illustrating `itemsStore`

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

</details>

---

## 2 🏁 creating the stores on startup

Once all descriptions are ready, you give them names, and pass them as parameters to `createStores()`

```js
/* ./index.js */

import itemsStore from './features/items/store-description.js';
import anyOtherStore from './features/whatever/store-description.js';

createStores({
  itemsStore,
  anyOtherStore
});
```

---

## 3: storeState ➡️ props

Listen to specific changes in a store for your local props by using the `useStore` hook.
Here is the example for our illustrating `itemsStore`, listening for updates on `store.items`

```js
/* ./features/items/container.js */

import React from 'react';
import ItemsComponent from './component';
import {useStore} from 'hookstores';

const propsMapping = {
  items: 'items'
};

const ItemsContainer = props => {
  const {items} = useStore('itemsStore', propsMapping);
  return <ItemsComponent items={items} />;
};
```

---

## 4 📡 dispatching actions

Use [`prop drilling`](https://kentcdodds.com/blog/prop-drilling) from your containers to your components: pass functions dispatching the actions

```js
import {dispatch} from 'hookstores';
import {SELECT_ITEM} from './features/items/store-description.js';

const ItemsContainer = props => {
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

## 🏗️ development

local dev [tips](docs/dev.md)
