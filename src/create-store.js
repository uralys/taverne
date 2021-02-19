// -----------------------------------------------------------------------------

import {produce} from 'immer';

// -----------------------------------------------------------------------------

const createStore = (storeKey, storeDescription) => {
  console.log('☢️ [hookstores] creating store', storeKey);

  const {initialState, middlewares} = storeDescription;

  // -------------------------------------------------

  let state = initialState;
  const subscriptions = [];
  const getState = () => state;

  // -------------------------------------------------

  const applyReducer = (reduce, payload) => {
    const previousState = getState();
    const newState = produce(previousState, draftState =>
      reduce(draftState, payload)
    );

    state = newState;

    subscriptions.forEach(onUpdate => {
      onUpdate(newState, previousState);
    });
  };

  // -------------------------------------------------

  const store = {
    storeKey,
    getState,
    onDispatch: action => {
      const {type, ...payload} = action;

      middlewares.forEach(({on, perform, reduce}) => {
        if (on === type) {
          if (typeof perform === 'function') {
            const result = perform(payload, getState);
            if (result.then) {
              result.then(_payload => {
                applyReducer(reduce, _payload);
              });
            } else {
              applyReducer(reduce, result);
            }
          } else {
            applyReducer(reduce, payload);
          }
        }
      });
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
