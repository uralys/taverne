# React example

## 🛠 setup

Here is the way to follow to setup `La Taverne` on your app:

- 1: Write `reactions`: the way your store must react to actions.
- 2: Pass your stores through the provider `<Taverne>`.
- 3: Read stores data in your containers
- 4: Dispatch actions to trigger `reactions`.

<details>
<summary>🔍 Illustration</summary>

In the following, let's illustrate how to use `Taverne` with:

- a store of `Items` and its fetch function
- a `container` plugged to this store,
- and the `component` rendering the list of items.

Illustration will be marked with 🔍

</details>

## 📦 create a store

You'll have to define a store with

- an initialState,
- and a list of reactions.

```js
const itemsStore = {
  initialState: {},
  reactions: []
};

export default itemsStore;
```

You should use one store for each feature.
(🔍 here the `itemsStore` to deal with the `Items`)

`La Taverne` will create the actual store for each of them to:

- handle an immutable state with [Immer](https://immerjs.github.io/immer/docs/introduction),
- listen to actions to trigger the appropriate `reactions`,
- emit updates to the containers when there are changes only.

![computeAction](https://user-images.githubusercontent.com/910636/103582817-e2d13600-4ede-11eb-8fbf-f0eb2a7cd3e7.png)

<details>
<summary>🔍 Example</summary>

Here is the example for our illustrating `itemsStore`

```js
/* ./features/items/store.js */
import apiCall from './fetch-items.js';

const FETCH_ITEMS = 'FETCH_ITEMS';

const initialState = {items: null};

const fetchItems = {
  on: FETCH_ITEMS,
  perform: async (parameters, getState) => {
    // This function will be called whenever {type:FETCH_ITEMS} is dispatched.
    // `getState` is provided here for convenience, to access the current store state.

    const items = await apiCall(parameters);
    return items;
  },
  reduce: (draft, payload) => {
    // 'reduce' will be called after `perform` is over.
    // 'perform' returns the items, so here payload === items
    draft.items = payload;
  }
};

const reactions = [fetchItems];

export default {initialState, reactions};
export {FETCH_ITEMS};
```

</details>

## 🏁 setup the Taverne provider with these stores

Once all stores are ready, and pass them as `stores` parameter to `<Taverne>`.

This is where you define names your stores.

`Taverne` will simply create hooks with the same names with the `use` prefix.

```js
whatheverNameStore ===> useWhatheverNameStore()
```

🔍 Example:

```js
/* ./index.js */
import React from 'react';
import {render} from 'react-dom';
import {Taverne} from 'taverne/hooks';

import itemsStore from './features/items/store.js';
import anyOtherStore from './features/whatever/store.js';

const stores = {
  itemsStore,
  anyOtherStore
};

render(
  <Taverne stores={stores}>
    <App />
  </Taverne>,
  container
);
```

here `La Taverne` will create those hooks:

```js
const {useItemsStore, useAnyOtherStore} = useTaverne();
```

## 🍕 Using those stores in your containers

### storeState ➡️ props

Listen to changes in a store and use in your local props by using the `useXxxxStore` hook that was created for your store.

🔍 Here is the example for our illustrating `itemsStore`:

```js
/* ./features/items/container.js */

import React from 'react';
import ItemsComponent from './component';

const ItemsContainer = props => {
  const {useItemsStore} = useTaverne();
  const {items} = useItemsStore();

  return <ItemsComponent items={items} />;
};
```

To listen to specific changes in a store, and update your local props only on those changes, use `propsMapping` (see the [advanced section](#-advanced-usage)).

## 📡 dispatching actions

Use [`prop drilling`](https://kentcdodds.com/blog/prop-drilling) from your containers to your components: pass functions dispatching the actions

```js
import {SELECT_ITEM} from './features/items/store.js';

const ItemsContainer = props => {
  const {dispatch} = useTaverne();

  const selectItem = id => () => {
    dispatch({
      type: SELECT_ITEM,
      itemId: id
    });
  };

  return <ItemsComponent selectItem={selectItem} />;
};
```

## 🔥 advanced usage

The whole point of `Taverne` is to be able to perform extremely local rendering.

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
  const {useItemsStore} = useTaverne();
  const {items, other} = useItemsStore(propsMapping);

  return <ItemsComponent items={items} other={other} />;
};
```

This way, on every store update, specific props will be extracted for the components, and nothing else: this will allow accurate local rendering from a global app state.
