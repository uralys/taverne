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

  console.log(`🏪 [hookstores] ${name} computes action`, action.type);

  const currentState = getState();

  computeAction(currentState, action).then(newState => {
    subscriptions.forEach(subscription => {
      subscription(newState, action);
    });

    console.log(
      `🏪 [hookstores] ${name} successfully notified all containers after ${action.type}`
    );
  });
};

// -----------------------------------------------------------------------------

const createStore = storeDescription => {
  const {name, initialState} = storeDescription;
  console.log('☢️ [hookstores] creating store', name);
  let state = initialState;
  const subscriptions = [];

  // -------------------------------------------------
  // computeAction is async, it will update storeState onSuccess

  const storeStateUpdate = newState => {
    state = newState;
  };

  subscriptions.push(storeStateUpdate);

  // -------------------------------------------------

  const compute = createComputer(() => state, subscriptions, storeDescription);

  // -------------------------------------------------

  const store = {
    name,
    getState: () => state,
    onDispatch: action => {
      if (action.scope && action.scope !== name) {
        console.log(`🏪 [hookstores] ${name} out of scope`);
        return;
      }
      state = compute(action);
    },
    subscribe: subscription => {
      console.log(`✅ [hookstores] adding a subscription to ${name}`);
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
