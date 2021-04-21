// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';

// -----------------------------------------------------------------------------

const isDebounced = (action = {}) => {
  if (action.devtools && action.devtools.debounce) {
    return true;
  }

  if (!action.from) {
    return false;
  }

  return isDebounced(action.from);
};

// -----------------------------------------------------------------------------

const getNesting = (action = {}) => {
  if (!action.from) {
    return '';
  }

  return '──' + getNesting(action.from);
};

// -----------------------------------------------------------------------------

const rootType = (action = {}) => {
  if (!action.from) {
    return action.type;
  }

  return rootType(action.from);
};

// -----------------------------------------------------------------------------

const orderParentActions = (action = {}) => {
  if (!action.from) {
    return [action];
  }

  return [...orderParentActions(action.from), action];
};

// -----------------------------------------------------------------------------

const record = (
  devtoolsInstance,
  action,
  dispatch,
  getState,
  applyStateFiltering
) => {
  let type = action.type;

  const nesting = getNesting(action.from);
  type = `${action.from ? `└──${nesting}` : ''} ${type}`;

  const currentState = getState();
  const state = applyStateFiltering(currentState);

  devtoolsInstance.send(
    {
      ...action,
      type
    },
    state
  );

  action.__recorded = true;
};

// -----------------------------------------------------------------------------

const recordDebouncedTree = (
  devtoolsInstance,
  action,
  dispatch,
  getState,
  applyStateFiltering
) => {
  const actions = orderParentActions(action);

  actions.forEach(action => {
    record(
      devtoolsInstance,
      {
        type: `${action.type} (debounced x ${
          devtoolsInstance.debounceCount[rootType(action)]
        })`,
        from: action.from
      },
      dispatch,
      getState,
      applyStateFiltering
    );
  });
};

// -----------------------------------------------------------------------------

const createDevtools = (options = {}) => taverne => {
  const extension = window && window.__REDUX_DEVTOOLS_EXTENSION__;
  const {applyStateFiltering = o => o} = options;

  if (!extension) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ Could not connect Redux devtools. \nTry to install and enable the extension'
      );
    }

    return;
  }

  const initialState = taverne.getState();
  const devtoolsInstance = extension.connect({maxAge: 100});
  devtoolsInstance.timeouts = {};
  devtoolsInstance.debounceCount = {};

  devtoolsInstance.init(initialState);

  devtoolsInstance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      taverne.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  devtoolsInstance.onDispatch = (action, dispatch, getState) => {
    if (action.__recorded) {
      return;
    }

    if (isDebounced(action)) {
      const actionRootType = rootType(action);

      if (devtoolsInstance.debounceCount[actionRootType] === undefined) {
        devtoolsInstance.debounceCount[actionRootType] = 0;
      }

      if (actionRootType === action.type) {
        devtoolsInstance.debounceCount[actionRootType]++;
      }

      if (devtoolsInstance.timeouts[actionRootType]) {
        clearTimeout(devtoolsInstance.timeouts[actionRootType]);
      }

      devtoolsInstance.timeouts[actionRootType] = setTimeout(() => {
        if (devtoolsInstance.debounceCount[actionRootType] > 0) {
          recordDebouncedTree(
            devtoolsInstance,
            action,
            dispatch,
            getState,
            applyStateFiltering
          );
        }

        devtoolsInstance.debounceCount[actionRootType] = 0;
      }, 250);
    } else {
      devtoolsInstance.debounceCount[action.type] = 0;
      record(devtoolsInstance, action, dispatch, getState, applyStateFiltering);
    }
  };

  console.log(`${logPrefix} Plugged Redux devtools`);
  return devtoolsInstance;
};

// -----------------------------------------------------------------------------

export default createDevtools;
