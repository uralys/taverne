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
    const previousState = currentState;

    subscriptions.forEach(onUpdate => {
      onUpdate(newState, previousState, action);
    });
  });
};

// -----------------------------------------------------------------------------

const createStore = (storeKey, storeDescription) => {
  const {initialState} = storeDescription;
  console.log('☢️ [hookstores] creating store', storeKey);
  let state = initialState;
  const subscriptions = [];
  const getState = () => state;

  // -------------------------------------------------
  // computeAction is async, it will update storeState onSuccess

  const storeStateUpdate = newState => {
    state = newState;
  };

  subscriptions.push(storeStateUpdate);

  // -------------------------------------------------

  const compute = createComputer(
    getState,
    subscriptions,
    storeKey,
    storeDescription
  );

  // -------------------------------------------------

  const store = {
    storeKey,
    getState,
    onDispatch: action => {
      if (action.scope && action.scope !== storeKey) {
        console.log(`🏪 [hookstores] ${storeKey} out of scope`);
        return;
      }

      const newState = compute(action);
      if (newState) {
        state = newState;
      }
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
