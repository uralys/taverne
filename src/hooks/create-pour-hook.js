// -----------------------------------------------------------------------------

import deepEqual from 'deep-equal';
import {useEffect, useLayoutEffect, useState} from 'react';
import connectStore from '../stores/connect-store';
import get from '../lib/get';

// -----------------------------------------------------------------------------

// from https://github.com/pmndrs/zustand/blob/master/src/index.ts#L16-L17
// and https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// -----------------------------------------------------------------------------

const mapStateToProps = (state, _propsMapping = null) => {
  if (!_propsMapping) {
    return state;
  }

  let propsMapping = _propsMapping;

  if (typeof _propsMapping === 'string') {
    return get(propsMapping, state);
  }

  if (typeof _propsMapping === 'function') {
    propsMapping = _propsMapping(state);
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

const createUpdater = (setProps, propsMapping = null, defaultPouring) => {
  const onUpdate = (storeState, previousState) => {
    const prevProps =
      previousState && mapStateToProps(previousState, propsMapping);
    const newProps = mapStateToProps(storeState, propsMapping);

    if (newProps !== undefined) {
      if (!deepEqual(newProps, prevProps)) {
        setProps(newProps);
      }
    } else {
      if (!deepEqual(defaultPouring, prevProps)) {
        setProps(defaultPouring);
      }
    }
  };

  return onUpdate;
};

// -----------------------------------------------------------------------------

const createPourHook = store =>
  function pour(propsMapping = null, defaultPouring) {
    const [props, setProps] = useState();
    const onUpdate = createUpdater(setProps, propsMapping, defaultPouring);

    useIsoLayoutEffect(() => {
      const disconnect = connectStore(store, onUpdate);
      return disconnect;
    }, []);

    return props ? {...props} : undefined;
  };

// -----------------------------------------------------------------------------

export default createPourHook;
