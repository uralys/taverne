# hookstores

## external package

should be published using un extracted version of <https://github.com/chrisdugne/testing-stores/blob/master/src/lib/hookstores/>

track <https://github.com/chrisdugne/testing-stores/issues/1>

## usage (preparing package readme)

### context providers

use `Dispatcher` and `Stores` contexts providers

```js
import {Dispatcher, Stores} from 'hookstores';
```

```html
<Dispatcher>
  <Stores>
    <App id="{id}" />
  </Stores>
</Dispatcher>
```

### descriptions

list all stores within `stores-descriptions.js`:

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

- name
- handledActions
- createReducer
- export factory

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
