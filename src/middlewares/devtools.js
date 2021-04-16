// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';

// -----------------------------------------------------------------------------

const isDebounced = (action = {}) => {
  if (!action.from) {
    return action.devtools && action.devtools.debounce;
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

const orderParentActions = (action = {}) => {
  if (!action.from) {
    return [action];
  }

  return [...orderParentActions(action.from), action];
};

// -----------------------------------------------------------------------------

const record = (devtoolsInstance, action, dispatch, getState) => {
  let type = action.type;

  const nesting = getNesting(action.from);
  type = `${action.from ? `└──${nesting}` : ''} ${type}`;

  devtoolsInstance.send(
    {
      ...action,
      type
    },
    getState()
  );
};

// -----------------------------------------------------------------------------

const recordDebouncedTree = (devtoolsInstance, action, dispatch, getState) => {
  const actions = orderParentActions(action);

  actions.forEach(action => {
    record(
      devtoolsInstance,
      {
        type: `${action.type}/debounced (${devtoolsInstance.debounceCount})`,
        from: action.from
      },
      dispatch,
      getState
    );
  });
};

// -----------------------------------------------------------------------------

const createDevtools = taverne => {
  const extension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

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
  devtoolsInstance.timeout = null;
  devtoolsInstance.previousAction = {type: ''};

  devtoolsInstance.init(initialState);

  devtoolsInstance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      taverne.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  devtoolsInstance.onDispatch = (action, dispatch, getState) => {
    if (isDebounced(action)) {
      if (devtoolsInstance.timeout) {
        clearTimeout(devtoolsInstance.timeout);
      }

      if (!action.from) {
        devtoolsInstance.debounceCount++;
      }

      devtoolsInstance.timeout = setTimeout(() => {
        if (devtoolsInstance.debounceCount > 0) {
          recordDebouncedTree(devtoolsInstance, action, dispatch, getState);
        }

        devtoolsInstance.debounceCount = 0;
      }, 250);
    } else {
      devtoolsInstance.debounceCount = 0;
      record(devtoolsInstance, action, dispatch, getState);
    }
  };

  console.log(`${logPrefix} Plugged Redux devtools`);
  return devtoolsInstance;
};

// -----------------------------------------------------------------------------

export default createDevtools;
