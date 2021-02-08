// -----------------------------------------------------------------------------

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

const createUpdater = (propsMapping, setProps) => {
  const onUpdate = storeState => {
    const newProps = Object.keys(propsMapping).reduce((acc, property) => {
      return {
        ...acc,
        [property]: get(propsMapping[property], storeState)
      };
    }, {});

    setProps(newProps);
  };

  return onUpdate;
};

// -----------------------------------------------------------------------------

const useStore = (storeKey, propsMapping) => {
  const store = stores[storeKey];

  if (!store) {
    const knownKeys = Object.keys(stores).join(',');
    throw new Error(
      `🔴 store "${storeKey}" was not found within your stores. Available keys: [${knownKeys}].`
    );
  }

  const [props, setProps] = useState({});
  const onUpdate = createUpdater(propsMapping, setProps);

  useIsoLayoutEffect(() => {
    const disconnect = connectStore(store, onUpdate);
    return disconnect;
  }, []);

  return {...props};
};

// -----------------------------------------------------------------------------

export {createStores, useStore, dispatch};
