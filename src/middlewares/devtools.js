// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';

// -----------------------------------------------------------------------------

const getNesting = (action = {}) => {
  if (!action.from) {
    return '';
  }

  return '──' + getNesting(action.from);
};

// -----------------------------------------------------------------------------

function createOnDispatch(devtoolsInstance) {
  return function (action, dispatch, getState) {
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
}

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
  devtoolsInstance.timeout = 0;
  devtoolsInstance.previousActionType = '';

  const onDispatch = createOnDispatch(devtoolsInstance);

  devtoolsInstance.init(initialState);

  devtoolsInstance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      taverne.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  devtoolsInstance.onDispatch = (action, dispatch, getState) => {
    if (devtoolsInstance.previousActionType === action.type) {
      clearTimeout(devtoolsInstance.timeout);
      devtoolsInstance.debounceCount++;
      onDispatch(action, dispatch, getState);
    } else {
      devtoolsInstance.debounceCount = 0;
    }

    devtoolsInstance.previousActionType = action.type;
    devtoolsInstance.timeout = setTimeout(() => {
      if (devtoolsInstance.debounceCount > 0) {
        onDispatch(
          {
            type: `${action.type}/debounced (${devtoolsInstance.debounceCount})`,
            from: action.from
          },
          dispatch,
          () => {}
        );
      }
      onDispatch(action, dispatch, getState);
      devtoolsInstance.debounceCount = 0;
    }, 250);
  };

  console.log(`${logPrefix} Plugged Redux devtools`);
  return devtoolsInstance;
};

// -----------------------------------------------------------------------------

export default createDevtools;
