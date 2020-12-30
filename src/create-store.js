// -----------------------------------------------------------------------------

const createComputer = (
  getState,
  subscriptions,
  storeDescription
) => action => {
  const {handledActions, storeName, computeAction} = storeDescription;

  if (!handledActions.includes(action.type)) {
    return;
  }

  console.log(`🏪 [hookstore|reducer] ${storeName} computeAction`, action.type);

  const currentState = getState();
  const newState = computeAction(currentState, action);

  subscriptions.forEach(subscription => {
    subscription(newState, action);
  });

  return newState;
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
      if (action.scope && action.scope !== store.id) {
        console.log(`🏪 [hookstores] ${store.id} out of scope`);
        return;
      }
      state = compute(action);
    },
    subscribe: subscription => {
      console.log(
        `✅ [hookstores] adding a subscription to ${store.id}`,
        subscription
      );
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);

      console.log(
        `✅ [hookstores] removed a subscription to ${store.id}`,
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
