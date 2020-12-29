// -----------------------------------------------------------------------------

const createStore = (id = 'default', initialState, createReducer) => {
  console.log('☢️ [hookstores] creating store', id);
  const subscriptions = [];
  let state = initialState;

  const reduceAction = createReducer(() => state, subscriptions);

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
