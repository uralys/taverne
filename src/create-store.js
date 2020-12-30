// -----------------------------------------------------------------------------

const createReducer = (
  getState,
  subscriptions,
  storeName,
  handledActions,
  reduce
) => action => {
  if (!handledActions.includes(action.type)) {
    return;
  }

  console.log(`🏪 [hookstore|reducer] ${storeName} reduceAction`, action.type);

  const currentState = getState();
  const newState = reduce(currentState, action);

  subscriptions.forEach(subscription => {
    subscription(newState, action);
  });

  return newState;
};

// -----------------------------------------------------------------------------

const createStore = (
  id = 'default',
  storeName,
  initialState,
  handledActions,
  reduce
) => {
  console.log('☢️ [hookstores] creating store', id);
  const subscriptions = [];
  let state = initialState;

  const reduceAction = createReducer(
    () => state,
    subscriptions,
    storeName,
    handledActions,
    reduce
  );

  const store = {
    id,
    onDispatch: action => {
      if (action.scope && action.scope !== store.id) {
        console.log(`🏪 [hookstores] ${store.id} out of scope`);
        return;
      }
      state = reduceAction(action);
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
      id,
      state,
      subscriptions
    })
  };

  return store;
};

// -----------------------------------------------------------------------------

export default createStore;
