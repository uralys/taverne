// -----------------------------------------------------------------------------

import deepEqual from 'deep-equal';
import {useEffect, useLayoutEffect, useState} from 'react';
import createStore from './create-store';
import connectStore from './connect-store';
import get from './get';

// -----------------------------------------------------------------------------

// from https://github.com/pmndrs/zustand/blob/master/src/index.ts#L16-L17
// and https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// -----------------------------------------------------------------------------

const mapStateToProps = (state, propsMapping = null) => {
  if (!propsMapping) {
    return state;
  }

  const selectedProps = Object.keys(propsMapping).reduce(
    (acc, property) => ({
      ...acc,
      [property]: get(propsMapping[property], state)
    }),
    {}
  );

  return selectedProps;
};

// -----------------------------------------------------------------------------

const createUpdater = (setProps, propsMapping = null) => {
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

const createUseStore = store =>
  function useStore(propsMapping = null) {
    const [props, setProps] = useState({});
    const onUpdate = createUpdater(setProps, propsMapping);

    useIsoLayoutEffect(() => {
      console.log(`☢️ [hookstores] connecting store ${store.storeKey}`);
      const disconnect = connectStore(store, onUpdate);
      return disconnect;
    }, []);

    return {...props};
  };

// -----------------------------------------------------------------------------

const createHooks = stores =>
  Object.keys(stores).reduce(
    (acc, storeKey) => ({
      ...acc,
      [`use${storeKey}`]: createUseStore(stores[storeKey])
    }),
    {}
  );

// -----------------------------------------------------------------------------

const createDispatch = stores =>
  function dispatch(action) {
    console.log('📡 [hookstores] dispatching', action);
    Object.keys(stores).forEach(storeKey => {
      stores[storeKey].onDispatch(action);
    });
  };

// -----------------------------------------------------------------------------

const createStores = descriptions => {
  console.log('☢️ [hookstores] creating Hookstores...', descriptions);
  const stores = Object.keys(descriptions).reduce((acc, storeKey) => {
    console.log(`☢️ [hookstores] registering ${storeKey}`);
    const store = createStore(storeKey, descriptions[storeKey]);

    return {
      ...acc,
      [storeKey]: store
    };
  }, {});

  const dispatch = createDispatch(stores);
  const hooks = createHooks(stores);

  return {dispatch, ...hooks, stores};
};

// -----------------------------------------------------------------------------

export default createStores;
