// -----------------------------------------------------------------------------

import createTaverne from './create-taverne';

// -----------------------------------------------------------------------------

const createMiddlewares = (taverne, middlewaresCreators) => {
  const middlewares = middlewaresCreators.reduce((acc, createMiddleware) => {
    const instance = createMiddleware(taverne);
    if (instance) {
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

    const applyMiddlewares = () => {
      middlewares.forEach(middleware => {
        middleware.onDispatch &&
          middleware.onDispatch(action, dispatch, taverne.getState);
      });
    };

    let middlewaresApplied = false;

    const _dispatch = action => {
      applyMiddlewares();
      middlewaresApplied = true;
      dispatch(action);
    };

    taverne.onDispatch(action, _dispatch, taverne.getState);

    if (!middlewaresApplied) {
      applyMiddlewares();
    }
  };

  return dispatch;
};

// -----------------------------------------------------------------------------

const createLaTaverne = (barrels, middlewaresCreators = []) => {
  const taverne = createTaverne(barrels);
  const middlewares = createMiddlewares(taverne, middlewaresCreators);
  const dispatch = createDispatch(taverne, middlewares);

  return {dispatch, taverne};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
