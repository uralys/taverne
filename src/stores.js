// -----------------------------------------------------------------------------

import createStore from './create-store';

// -----------------------------------------------------------------------------

let stores;

// -----------------------------------------------------------------------------

const createStores = descriptions => {
  console.log('☢️ [hookstores] creating Hookstores...', descriptions);
  stores = Object.keys(descriptions).reduce((acc, storeKey) => {
    console.log(`☢️ [hookstores] registering ${storeKey}`);
    const store = createStore(storeKey, descriptions[storeKey]);

    return {
      ...acc,
      [storeKey]: store
    };
  }, {});
};

// -----------------------------------------------------------------------------

const dispatch = action => {
  console.log('📡 [hookstores] dispatching', action);
  Object.keys(stores).forEach(storeKey => {
    stores[storeKey].onDispatch(action);
  });
};

// -----------------------------------------------------------------------------

const useStores = () => {
  // for debugging purposes - *will be removed* 🧐
  window.stores = stores;

  return {...stores, dispatch};
};

// -----------------------------------------------------------------------------

export {createStores, useStores};
