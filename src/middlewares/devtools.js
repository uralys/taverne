// -----------------------------------------------------------------------------

const logPrefix = '[La Taverne 🐛]';
let devtools;

// -----------------------------------------------------------------------------

const getGlobalState = stores => {
  const globalState = Object.keys(stores).reduce((acc, storeKey) => {
    return {
      ...acc,
      [storeKey]: stores[storeKey].getState()
    };
  }, {});

  return globalState;
};

// -----------------------------------------------------------------------------

const setGlobalState = (stores, globalStateToSet) => {
  Object.keys(stores).forEach(storeKey => {
    const revertState = globalStateToSet[storeKey];
    stores[storeKey].setState(revertState);
  });
};

// -----------------------------------------------------------------------------

const onCreate = (dispatch, stores) => {
  const extension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

  if (!extension && process.env.NODE_ENV === 'development') {
    console.error(
      '❌ Could not connect Redux devtools. \nTry to install and enable the extension'
    );
    return;
  }

  const initialState = getGlobalState(stores);
  devtools.instance = extension.connect();
  devtools.instance.init(initialState);

  devtools.instance.subscribe(message => {
    if (message.type === 'DISPATCH' && message.state) {
      setGlobalState(stores, JSON.parse(message.state));
    } else {
      console.log(`${logPrefix} monitor message not handled:`, message);
    }
  });

  console.log(`${logPrefix} Plugged Redux devtools`);
};

// -----------------------------------------------------------------------------

const onDispatch = (action, dispatch, stores) => {
  if (!devtools.instance) return;
  devtools.instance.send(action, getGlobalState(stores));
};

// -----------------------------------------------------------------------------

devtools = {
  onCreate,
  onDispatch
};

// -----------------------------------------------------------------------------

export default devtools;
