// -----------------------------------------------------------------------------

import deepEqual from 'deep-equal';
import {useEffect, useLayoutEffect, useState} from 'react';
import connectStore from '../connect-store';
import get from '../get';

// -----------------------------------------------------------------------------

// from https://github.com/pmndrs/zustand/blob/master/src/index.ts#L16-L17
// and https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// -----------------------------------------------------------------------------

const hookName = (storeKey = 'store') => {
  const upper = storeKey[0].toUpperCase();
  const following = storeKey.slice(1, storeKey.length);

  return `use${upper}${following}`;
};

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
    const [props, setProps] = useState(store.initialState);
    const onUpdate = createUpdater(setProps, propsMapping);

    useIsoLayoutEffect(() => {
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
      [hookName(storeKey)]: createUseStore(stores[storeKey])
    }),
    {}
  );

// -----------------------------------------------------------------------------

export default createHooks;
