// -----------------------------------------------------------------------------

import createStore from './create-store';

// -----------------------------------------------------------------------------

const createDispatch = (store, middlewares) => {
  const dispatch = action => {
    if (!action.type) {
      throw new Error(`❌ [La Taverne] dispatch: action.type is required`);
    }

    store.onDispatch(action, dispatch, store.getState);

    middlewares.forEach(middleware => {
      middleware.onDispatch(action, dispatch, store.getState);
    });
  };

  return dispatch;
};

// -----------------------------------------------------------------------------

const createLaTaverne = (reducers, middlewares = []) => {
  const store = createStore(reducers);
  const dispatch = createDispatch(store, middlewares);

  middlewares.forEach(middleware => {
    middleware.onCreate(dispatch, store);
  });

  return {dispatch, store};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
