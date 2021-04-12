// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';

// -----------------------------------------------------------------------------

const onCreate = taverne => {
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
  const devtoolsInstance = extension.connect();
  devtoolsInstance.init(initialState);

  devtoolsInstance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      taverne.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  console.log(`${logPrefix} Plugged Redux devtools`);
  return devtoolsInstance;
};

// -----------------------------------------------------------------------------

const onDispatch = (action, dispatch, getState, devtoolsInstance) => {
  if (!devtoolsInstance) return;
  devtoolsInstance.send(action, getState());
};

// -----------------------------------------------------------------------------

export default {
  onCreate,
  onDispatch
};
