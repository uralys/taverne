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
        from: {
          type: action.type,
          devtools: action.devtools,
          from: action.from
        }
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

const checkBarrels = barrels => {
  Object.keys(barrels).forEach(key => {
    barrels[key].reactions.forEach(reaction => {
      if (!reaction.on) {
        throw new Error(
          `issue with barrel ${key} --> reaction.on is undefined`
        );
      }
    });
  });
};

// -----------------------------------------------------------------------------

const createLaTaverne = (barrels, middlewaresCreators = []) => {
  checkBarrels(barrels);
  const taverne = createTaverne(barrels);
  const middlewares = createMiddlewares(taverne, middlewaresCreators);
  const dispatch = createDispatch(taverne, middlewares);

  return {dispatch, taverne};
};

// -----------------------------------------------------------------------------

export default createLaTaverne;
