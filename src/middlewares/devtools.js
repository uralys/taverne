// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';
let devtools;

// -----------------------------------------------------------------------------

const onCreate = (dispatch, store) => {
  const extension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

  if (!extension) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '❌ Could not connect Redux devtools. \nTry to install and enable the extension'
      );
    }

    return;
  }

  const initialState = store.getState();
  devtools.instance = extension.connect();
  devtools.instance.init(initialState);

  devtools.instance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      store.setState(JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  console.log(`${logPrefix} Plugged Redux devtools`);
};

// -----------------------------------------------------------------------------

const onDispatch = (action, dispatch, getState) => {
  if (!devtools.instance) return;
  devtools.instance.send(action, getState());
};

// -----------------------------------------------------------------------------

devtools = {
  onCreate,
  onDispatch
};

// -----------------------------------------------------------------------------

export default devtools;
