// -----------------------------------------------------------------------------

import createTaverne from './create-taverne';

// -----------------------------------------------------------------------------

const createMiddlewares = (taverne, middlewaresCreators) => {
  const middlewares = middlewaresCreators.reduce((acc, createMiddleware) => {
    const instance = createMiddleware(taverne);

    if (instance) {
      instance.detach = () => {
        middlewares.splice(middlewares.indexOf(instance), 1);
      };

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
      console.log('nb middlewares', middlewares.length);
      middlewares.forEach(middleware => {
        middleware.onDispatch &&
          middleware.onDispatch(action, dispatch, taverne.getState);
      });
    };

    let middlewaresApplied = false;

    const nextDispatch = nextAction => {
      applyMiddlewares();
      middlewaresApplied = true;
      dispatch({
        ...nextAction,
        from: action
      });
    };

    nextDispatch.rootFunction = dispatch;

    taverne.onDispatch(action, nextDispatch, taverne.getState);

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
