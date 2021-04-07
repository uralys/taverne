// -----------------------------------------------------------------------------

import createTaverne from './create-taverne';

// -----------------------------------------------------------------------------

const createDispatch = (taverne, middlewares) => {
  const dispatch = action => {
    if (!action.type) {
      throw new Error(`❌ [La Taverne] dispatch: action.type is required`);
    }

    taverne.onDispatch(action, dispatch, taverne.getState);

    middlewares.forEach(middleware => {
      middleware.onDispatch(action, dispatch, taverne.getState);
    });
  };

  return dispatch;
};

// -----------------------------------------------------------------------------

const createLaTaverne = (barrels, middlewares = []) => {
  const taverne = createTaverne(barrels);
  const dispatch = createDispatch(taverne, middlewares);

  middlewares.forEach(middleware => {
    middleware.onCreate(dispatch, taverne);
  });

  return {dispatch, taverne};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
