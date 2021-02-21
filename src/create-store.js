// -----------------------------------------------------------------------------

import {produce} from 'immer';

// -----------------------------------------------------------------------------

const createStore = (storeKey, initialState, reactions) => {
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
    onDispatch: (action, dispatch) => {
      const {type, ...payload} = action;

      reactions.forEach(({on, perform, reduce}) => {
        if (on === type) {
          if (typeof perform === 'function') {
            const result = perform(payload, getState, dispatch);
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
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);
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
