// -----------------------------------------------------------------------------

const createComputer = (
  getState,
  subscriptions,
  storeDescription
) => action => {
  const {handledActions, name, computeAction} = storeDescription;

  if (!handledActions.includes(action.type)) {
    return;
  }

  console.log(`🏪 [hookstore] ${name} computes action`, action.type);

  const currentState = getState();

  computeAction(currentState, action).then(newState => {
    subscriptions.forEach(subscription => {
      subscription(newState, action);
    });
  });
};

// -----------------------------------------------------------------------------

const createStore = storeDescription => {
  const {name, initialState} = storeDescription;
  console.log('☢️ [hookstores] creating store', name);
  const subscriptions = [];
  let state = initialState;

  const compute = createComputer(() => state, subscriptions, storeDescription);

  const store = {
    name,
    onDispatch: action => {
      if (action.scope && action.scope !== name) {
        console.log(`🏪 [hookstores] ${name} out of scope`);
        return;
      }
      state = compute(action);
    },
    subscribe: subscription => {
      console.log(
        `✅ [hookstores] adding a subscription to ${name}`,
        subscription
      );
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);

      console.log(
        `✅ [hookstores] removed a subscription to ${name}`,
        subscription
      );
    },
    debug: () => ({
      name,
      state,
      subscriptions
    })
  };

  return store;
};

// -----------------------------------------------------------------------------

export default createStore;
