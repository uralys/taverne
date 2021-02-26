// -----------------------------------------------------------------------------

import {produce} from 'immer';

// -----------------------------------------------------------------------------

const createStore = (storeKey, initialState, reactions) => {
  let state = initialState;
  const subscriptions = [];
  const getState = () => state;
  const setState = (newState, _previousState) => {
    const previousState = _previousState || getState();
    state = newState;

    subscriptions.forEach(onUpdate => {
      onUpdate(newState, previousState);
    });
  };

  // -------------------------------------------------

  const applyReducer = (reduce, payload) => {
    if (!reduce) {
      return;
    }

    const previousState = getState();
    const newState = produce(previousState, draftState =>
      reduce(draftState, payload)
    );

    setState(newState, previousState);
  };

  // -------------------------------------------------

  const store = {
    storeKey,
    initialState,
    getState,
    setState,
    onDispatch: (action, dispatch, stores) => {
      const {type, ...payload} = action;

      reactions.forEach(({on, perform, reduce}) => {
        if (on === type) {
          if (typeof perform === 'function') {
            const result = perform(payload, getState, dispatch, stores);
            if (result && result.then) {
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
