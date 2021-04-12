// -----------------------------------------------------------------------------

import createTaverne from './create-taverne';

// -----------------------------------------------------------------------------

const createMiddlewares = (taverne, middlewaresSetup) => {
  const middlewares = middlewaresSetup.reduce((acc, middleware) => {
    const instance = middleware.onCreate(taverne);
    if (instance) {
      instance.onDispatch = middlewaresSetup.onDispatch;
      acc.push(instance);
    }
    return acc;
  }, []);

  return middlewares;
};

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

const createLaTaverne = (barrels, middlewaresSetup = []) => {
  const taverne = createTaverne(barrels);
  const middlewares = createMiddlewares(taverne, middlewaresSetup);
  const dispatch = createDispatch(taverne, middlewares);

  return {dispatch, taverne};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
