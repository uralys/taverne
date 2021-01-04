// -----------------------------------------------------------------------------

const createComputer = (
  getState,
  subscriptions,
  storeKey,
  storeDescription
) => action => {
  const {handledActions, computeAction} = storeDescription;

  if (!handledActions.includes(action.type)) {
    return;
  }

  console.log(`🏪 [hookstores] ${storeKey} computes action`, action.type);

  const currentState = getState();

  computeAction(currentState, action).then(newState => {
    subscriptions.forEach(subscription => {
      subscription(newState, action);
    });

    console.log(
      `🏪 [hookstores] ${storeKey} successfully notified all containers after ${action.type}`
    );
  });
};

// -----------------------------------------------------------------------------

const createStore = (storeKey, storeDescription) => {
  const {initialState} = storeDescription;
  console.log('☢️ [hookstores] creating store', storeKey);
  let state = initialState;
  const subscriptions = [];

  // -------------------------------------------------
  // computeAction is async, it will update storeState onSuccess

  const storeStateUpdate = newState => {
    state = newState;
  };

  subscriptions.push(storeStateUpdate);

  // -------------------------------------------------

  const compute = createComputer(
    () => state,
    subscriptions,
    storeKey,
    storeDescription
  );

  // -------------------------------------------------

  const store = {
    storeKey,
    getState: () => state,
    onDispatch: action => {
      if (action.scope && action.scope !== storeKey) {
        console.log(`🏪 [hookstores] ${storeKey} out of scope`);
        return;
      }
      state = compute(action);
    },
    subscribe: subscription => {
      console.log(`✅ [hookstores] adding a subscription to ${storeKey}`);
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);

      console.log(
        `✅ [hookstores] removed a subscription to ${storeKey}`,
        subscription
      );
    },
    debug: () => ({
      storeKey,
      state,
      subscriptions
    })
  };

  return store;
};

// -----------------------------------------------------------------------------

export default createStore;
