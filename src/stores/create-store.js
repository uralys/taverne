// -----------------------------------------------------------------------------

import {produce} from 'immer';
import get from '../lib/get';

// -----------------------------------------------------------------------------

const processReactions = (
  action,
  reactions,
  applyReducing,
  dispatch,
  getState
) => {
  const {type, ...payload} = action;

  reactions.forEach(({on, perform, reduce}) => {
    if (on === type) {
      if (typeof perform === 'function') {
        const result = perform(payload, dispatch, getState);
        if (result && result.then) {
          result.then(_payload => {
            applyReducing(reduce, _payload);
          });
        } else {
          applyReducing(reduce, result);
        }
      } else {
        applyReducing(reduce, payload);
      }
    }
  });
};

// -----------------------------------------------------------------------------

const createReducing = (nestedPath, getState, setState, dispatch, action) =>
  function applyReducing(reduce, payload) {
    if (!reduce) {
      return;
    }

    const currentStoreState = getState();
    const previousNestedState = get(nestedPath, currentStoreState);
    const newNestedState = produce(previousNestedState, draftState =>
      reduce(draftState, payload)
    );

    setState(newNestedState, nestedPath);
    dispatch({type: `${action.type}/success`});
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

  const getState = () => state;
  const setState = (newState, nestedPath) => {
    const previousState = {...getState()};

    if (nestedPath) {
      state[nestedPath] = newState;
    } else {
      state = newState;
    }

    subscriptions.forEach(onUpdate => {
      onUpdate(state, previousState);
    });
  };

  // -------------------------------------------------

  const store = {
    initialState,
    getState,
    setState,
    onDispatch: (action, dispatch, getState) => {
      Object.keys(reducers).forEach(key => {
        const applyReducing = createReducing(
          key,
          getState,
          setState,
          dispatch,
          action
        );
        const {reactions} = reducers[key];
        processReactions(action, reactions, applyReducing, dispatch, getState);
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
