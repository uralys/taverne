# ⛵ hookstores <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/npm/v/hookstores?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/hookstores"><img src="https://img.shields.io/badge/-experimental-5908d2.svg" alt="Experimental solution." /> </a>

[![peerDeps](https://david-dm.org/uralys/hookstores/peer-status.svg)](https://david-dm.org/uralys/hookstores?type=peer)
[![devDeps](https://david-dm.org/uralys/hookstores/dev-status.svg)](https://david-dm.org/uralys/hookstores?type=dev)
[![deps](https://david-dm.org/uralys/hookstores/status.svg)](https://david-dm.org/uralys/hookstores)

`Hookstores` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation using React hooks.

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

---

## 📦 installation

```sh
> npm i --save hookstores
```

Then wrap your React app with the context Provider:

```js
import React from 'react';
import {render} from 'react-dom';
import {Hookstores} from 'hookstores';

render(
  <Hookstores descriptions={descriptions}>
    <App />
  </Hookstores>,
  container
);
```

---

## 🎨 idea

- `Hookstores` allows to organize your React app State in one or many stores.
- Access local parts of this global state with `hooks`
- You can listen to specific parts of specific stores, to allow accurate local rendering from your global app state (see the [advanced section](#-advanced-usage)).

```js
const ItemsContainer = props => {
  const {useItemsStore} = useHookstores();
  const {items} = useItemsStore();

  return <ItemsComponent items={items} />;
};
```

---

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

## ✍️ descriptions

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

## 🏁 setup the Hookstores provider with these descriptions

Once all descriptions are ready, you give them names, and pass them as parameters to `createStores()`

```js
/* ./index.js */
import React from 'react';
import {render} from 'react-dom';
import {Hookstores} from 'hookstores';

import itemsStore from './features/items/store-description.js';
import anyOtherStore from './features/whatever/store-description.js';

render(
  <Hookstores
    descriptions={{
      itemsStore,
      anyOtherStore
    }}
  >
    <App />
  </Hookstores>,
  container
);
```

---

## storeState ➡️ props

Listen to changes in a store and use in your local props by using the `useXxxxStore` hook that was created for your store.

Here is the example for our illustrating `itemsStore`:

```js
/* ./features/items/container.js */

import React from 'react';
import ItemsComponent from './component';

const ItemsContainer = props => {
  const {useItemsStore} = useHookstores();
  const {items} = useItemsStore();

  return <ItemsComponent items={items} />;
};
```

To listen to specific changes in a store, and update your local props only on those changes, use `propsMapping` (see the [advanced section](#-advanced-usage)).

---

## 📡 dispatching actions

Use [`prop drilling`](https://kentcdodds.com/blog/prop-drilling) from your containers to your components: pass functions dispatching the actions

```js
import {SELECT_ITEM} from './features/items/store-description.js';

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

## 🔥 advanced usage

The whole point of `Hookstores` is to be able to perform extremely local rendering.

So, rather than the listening for the whole state updates, you can update rendering depending on specific updates in a store.

To do so, specify the `props` mapping you want to listen for changes, telling corresponding paths in your store.

```js
const propsMapping = {
  items: 'path.to.items.within.your.store',
  other: 'plop'
};
```

Now your `props` will change only when one of these mapping is updated in the store.

```js
const ItemsContainer = props => {
  const {useItemsStore} = useHookstores();
  const {items, other} = useItemsStore(propsMapping);

  return <ItemsComponent items={items} other={other} />;
};
```

This way, on every store update, specific props will be extracted for the components, and nothing else: this will allow accurate local rendering from a global app state.

---

## 📚 motivation

read this [doc](docs/motivation.md)

## 🏗️ development

local dev [tips](docs/dev.md)
