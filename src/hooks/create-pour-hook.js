// -----------------------------------------------------------------------------

import deepEqual from 'deep-equal';
import {useEffect, useLayoutEffect, useState} from 'react';
import connectTaverne from '../taverne/connect-taverne';
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

const createUpdater = (setProps, propsMapping = null) => {
  const onUpdate = (storeState, previousState) => {
    const prevProps =
      previousState && mapStateToProps(previousState, propsMapping);
    const newProps = mapStateToProps(storeState, propsMapping);

    if (!deepEqual(newProps, prevProps, {strict: true})) {
      setProps(newProps);
    }
  };

  return onUpdate;
};

// -----------------------------------------------------------------------------

const createPourHook = taverne =>
  function pour(propsMapping = null, _default) {
    const defaultProps =
      _default || (typeof propsMapping === 'string' ? undefined : {});

    const [props, setProps] = useState(defaultProps);
    const onUpdate = createUpdater(setProps, propsMapping);

    useIsoLayoutEffect(() => {
      const disconnect = connectTaverne(taverne, onUpdate);
      return disconnect;
    }, []);

    return props;
  };

// -----------------------------------------------------------------------------

export default createPourHook;
