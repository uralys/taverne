// -----------------------------------------------------------------------------

import {produce} from 'immer';
import get from '../lib/get';

// -----------------------------------------------------------------------------

const processReactions = (action, reactions, waitress, dispatch, getState) => {
  const {type, ...payload} = action;

  reactions.forEach(({on, perform, reduce}) => {
    if (on === type) {
      if (typeof perform === 'function') {
        const result = perform(payload, dispatch, getState);
        if (result && result.then) {
          result.then(_payload => {
            waitress(reduce, _payload);
          });
        } else {
          waitress(reduce, result);
        }
      } else {
        waitress(reduce, payload);
      }
    }
  });
};

// -----------------------------------------------------------------------------

const createWaitress = (brewPath, state, served) =>
  function waitress(reduce, payload) {
    if (!reduce) {
      return;
    }

    const previousState = get(brewPath, state);
    const newState = produce(previousState, draftState =>
      reduce(draftState, payload)
    );

    state[brewPath] = newState;
    served();
  };

// -----------------------------------------------------------------------------

const createStore = reducers => {
  const initialState = Object.keys(reducers).reduce(
    (acc, key) => ({
      ...acc,
      [key]: reducers[key].initialState
    }),
    {}
  );

  // -------------------------------------------------

  let state = initialState;
  const subscriptions = [];

  // -------------------------------------------------

  const served = _previousState => {
    const previousState = _previousState || state;

    subscriptions.forEach(onUpdate => {
      onUpdate(state, previousState);
    });
  };

  // -------------------------------------------------

  const store = {
    initialState,
    getState: () => state,
    setState: _state => {
      state = _state;
      served();
    },
    onDispatch: (action, dispatch, getState) => {
      Object.keys(reducers).forEach(key => {
        const waitress = createWaitress(key, state, served);
        const {reactions} = reducers[key];
        processReactions(action, reactions, waitress, dispatch, getState);
      });
    },
    subscribe: subscription => {
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);
    },
    debug: () => ({
      state,
      subscriptions
    })
  };

  return store;
};

// -----------------------------------------------------------------------------

export default createStore;
