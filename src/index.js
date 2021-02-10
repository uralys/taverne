// -----------------------------------------------------------------------------

import deepEqual from 'deep-equal';
import {useEffect, useLayoutEffect, useState} from 'react';
import createStore from './create-store';
import connectStore from './connect-store';
import get from './get';

// -----------------------------------------------------------------------------

let stores;

// -----------------------------------------------------------------------------

// from https://github.com/pmndrs/zustand/blob/master/src/index.ts#L16-L17
// and https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// -----------------------------------------------------------------------------

const dispatch = action => {
  console.log('📡 [hookstores] dispatching', action);
  Object.keys(stores).forEach(storeKey => {
    stores[storeKey].onDispatch(action);
  });
};

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

const mapStateToProps = (state, propsMapping) =>
  Object.keys(propsMapping).reduce(
    (acc, property) => ({
      ...acc,
      [property]: get(propsMapping[property], state)
    }),
    {}
  );

// -----------------------------------------------------------------------------

const createUpdater = (propsMapping, setProps) => {
  // eslint-disable-next-line no-unused-vars
  const onUpdate = (storeState, previousState) => {
    const prevProps = mapStateToProps(previousState, propsMapping);
    const newProps = mapStateToProps(storeState, propsMapping);

    if (!deepEqual(newProps, prevProps)) {
      setProps(newProps);
    }
  };

  return onUpdate;
};

// -----------------------------------------------------------------------------

const useStore = (storeKey, propsMapping) => {
  const store = stores[storeKey];

  if (!store) {
    const registeredStores = Object.keys(stores).join(',');
    throw new Error(
      `🔴 "${storeKey}" was not found within your stores.
      Be sure to register all your store-descriptions with createStores(), before to render the React app.
      Registered stores: [${registeredStores}].
      `
    );
  }

  const [props, setProps] = useState({});
  const onUpdate = createUpdater(propsMapping, setProps);

  useIsoLayoutEffect(() => {
    console.log(`☢️ [hookstores] connecting store ${storeKey}`);
    const disconnect = connectStore(store, onUpdate);
    return disconnect;
  }, []);

  return {...props};
};

// -----------------------------------------------------------------------------

export {createStores, useStore, dispatch};
