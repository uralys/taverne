# hookstores <a href="https://www.npmjs.com/package/@uralys/hookstores"><img src="https://img.shields.io/npm/v/@uralys/hookstores?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/@uralys/hookstores"><img src="https://img.shields.io/badge/status-experimental-127712.svg" alt="Experimental solution." /> </a>

Hookstores is a React Flux implementation with React hooks.

You may read further if you're interested in how to manage your state with your React appliction.

![](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

## motivation

- React is no more a `View` lib, it's now (v17) a complete framework: so either we pick a lighter lib for the `View`, or choosing React ❌ **we shouldn't need to use an additional external lib** such as Redux, MobX, RxJs, Recoil, Jotail...

- A first approach could be to use local states and sporadic use of React context, like [explained here](https://kentcdodds.com/blog/application-state-management-with-react) by Kent C. Dodds, but ❌ it's not a proper Flux implementation, I'd rather have **my entire app state fully separated from the `View`**, and "connect" [containers](https://medium.com/@learnreact/container-components-c0e67432e005), mapping sub-states to the views, the way Redux allows to.

- Using React context for a global app state, like [suggested here](https://ricostacruz.com/til/state-management-with-react-hooks) by Rico Sta. Cruz, [or here](https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/) by Ebenezer Don, would be ok for a _small application_, but would quickly lead to ❌ **tons of useless re-renderings**.
  That would eventually lead to lots of specific `useMemo` on every component requiring performance optimisation.
  So rather than to put the effort on developping on a proper state/component architecture, your effort will be spent on ❌ **writing those `useMemo` everywhere**.

## experimentation

The idea with `hookstores` is to implement a simple [Flux architecture](https://facebook.github.io/flux/docs/in-depth-overview)

- ✅ **splitting** the the global state into **stores**,
- ✅ applying **local rendering**, by mapping these stores to [containers](https://medium.com/@learnreact/container-components-c0e67432e005), using React hooks `useState` and `useEffect`.
- ✅ using React context only to provide the `Dispatcher` everywhere, and `StoresProvider` who is emitting events to listeners of specific stores only.

## installation

```sh
> npm i --save @uralys/hookstores
```

## setup

### context providers

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

## usage

### descriptions

list all stores within a root file `stores-descriptions.js`:

```js
import createItemsStore, {name as itemsStoreName} from 'path/to/items/store';
import createBallsStore, {name as ballsStoreName} from 'path/to/balls/store';

const storeDescriptions = {
  itemsStore: {
    id: 'items-store',
    prop: itemsStoreName,
    factory: createItemsStore
  },
  ballsStore: {
    id: 'balls-store',
    prop: ballsStoreName,
    factory: createBallsStore
  }
};

export default storeDescriptions;
```

### stores implementation

🏗️ currently improving this part

### create stores

First thing the `<App>` has to do is to instanciate all stores.
They will be registered and will listen to all `dispatched` actions through the `Dispatcher`.

```js
import {useStores} from 'hookstores';
import storeDescriptions from './stores-descriptions';

const {createStores} = useStores();

createStores(storeDescriptions);
```

### attach stores to containers props

compose your containers with every store you need

```js
import {withStore} from 'hookstores';
import storeDescriptions from './stores-descriptions';

const {ballsStore, itemsStore} = storeDescriptions;

const withItems = withStore(itemsStore);
const withBalls = withStore(ballsStore);

const Balls = withBalls(BallsContainer);
const Items = withItems(ItemsContainer);
const ItemsAndBalls = withItems(withBalls(OtherContainer));

return (
  <>
    <Balls />
    <Items />
    <ItemsAndBalls />
  </>
);
```

### apply state changes to components props

`subscribe` to store changes on component mounting

```js
import React, {useLayoutEffect, useState} from 'react';
import ItemsComponent from './component';
import {name as itemsStoreName} from 'path/to/items/store';

const ItemsContainer = props => {
  const [componentProps, setComponentProps] = useState();
  const itemsStore = props[itemsStoreName];

  useLayoutEffect(() => {
    const mapStateToProps = (state, action) => {
      setComponentProps({items: state.items});
    };

    itemsStore.subscribe(mapStateToProps);
  }, []);

  return <ItemsComponent {...componentProps} />;
};
```

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
