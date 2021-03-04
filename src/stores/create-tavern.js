// -----------------------------------------------------------------------------

import createStore from './create-store';

// -----------------------------------------------------------------------------

const createDispatch = (stores, middlewares) => {
  const dispatch = action => {
    if (!action.type) {
      throw new Error(`❌ [La Taverne] dispatch: action.type is required`);
    }

    Object.keys(stores).forEach(storeKey => {
      stores[storeKey].onDispatch(action, dispatch, stores);
    });

    middlewares.forEach(middleware => {
      middleware.onDispatch(action, dispatch, stores);
    });
  };

  return dispatch;
};

// -----------------------------------------------------------------------------

const createLaTaverne = (storeDefinitions, middlewares = []) => {
  const stores = Object.keys(storeDefinitions).reduce((acc, storeKey) => {
    const {initialState, reactions} = storeDefinitions[storeKey];
    const store = createStore(storeKey, initialState, reactions);

    return {
      ...acc,
      [storeKey]: store
    };
  }, {});

  const dispatch = createDispatch(stores, middlewares);

  middlewares.forEach(middleware => {
    middleware.onCreate(dispatch, stores);
  });

  return {dispatch, stores};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
