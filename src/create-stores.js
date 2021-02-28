// -----------------------------------------------------------------------------

import createStore from './create-store';

// -----------------------------------------------------------------------------

const createDispatch = (stores, middlewares) => {
  const dispatch = action => {
    console.log('📡 [hookstores] dispatching', action);

    if (!action.type) {
      throw new Error(`❌ [hookstores] dispatch: action.type is required`);
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

const createStores = (definitions, middlewares = []) => {
  const stores = Object.keys(definitions).reduce((acc, storeKey) => {
    const {initialState, reactions} = definitions[storeKey];
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

export default createStores;
