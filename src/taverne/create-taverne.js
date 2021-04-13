// -----------------------------------------------------------------------------

import {produce} from 'immer';
import get from '../lib/get';

// -----------------------------------------------------------------------------

const resolve = (
  action,
  reduce,
  dataToReduce,
  applyReducing,
  dispatch,
  getState,
  after
) => {
  try {
    applyReducing(reduce, dataToReduce);
  } catch (error) {
    console.error(error);
    dispatch({
      type: `${action.type}/reducing-error`,
      payload: {error: error.message, action}
    });
    return;
  }

  if (typeof after === 'function') {
    try {
      after(dataToReduce, dispatch, getState);
    } catch (error) {
      console.error(error);
      dispatch({
        type: `${action.type}/after-error`,
        payload: {error: error.message, action}
      });
      return;
    }
  }
};
// -----------------------------------------------------------------------------

const processReactions = (
  action,
  reactions,
  applyReducing,
  dispatch,
  getState
) => {
  const {type, payload} = action;

  reactions.forEach(({on, perform, reduce, after}) => {
    if (on === type) {
      if (typeof perform === 'function') {
        let result;
        try {
          result = perform(payload, dispatch, getState);
        } catch (error) {
          console.error(error);
          dispatch({
            type: `${type}/perform-error`,
            payload: {error: error.message, action}
          });
          return;
        }

        if (result && result.then) {
          dispatch({type: `${type}/processing`});

          result.then(asyncResult => {
            resolve(
              action,
              reduce,
              asyncResult,
              applyReducing,
              dispatch,
              getState,
              after
            );

            dispatch({type: `${type}/success`, payload: asyncResult});
          });
        } else {
          resolve(
            action,
            reduce,
            result,
            applyReducing,
            dispatch,
            getState,
            after
          );
        }
      } else {
        resolve(
          action,
          reduce,
          payload,
          applyReducing,
          dispatch,
          getState,
          after
        );
      }
    }
  });
};

// -----------------------------------------------------------------------------

const createReducing = (nestedPath, getState, setState) =>
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
  };

// -----------------------------------------------------------------------------

const createTaverne = barrels => {
  const initialState = Object.keys(barrels).reduce(
    (acc, key) => ({
      ...acc,
      [key]: barrels[key].initialState
    }),
    {}
  );

  // -------------------------------------------------

  let state = initialState;

  // subscriptions will be notified every time the state has changed
  const subscriptions = [];

  // listeners will be notified onDispatch
  const listeners = [];

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

  const barrelsReducing = Object.keys(barrels).reduce(
    (acc, key) => ({
      ...acc,
      [key]: createReducing(key, getState, setState)
    }),
    {}
  );

  // -------------------------------------------------

  const taverne = {
    initialState,
    getState,
    setState,
    onDispatch: (action, dispatch, getState) => {
      listeners.forEach(listen => listen && listen(action));
      console.log('--> nb listeners', listeners.length);

      Object.keys(barrels).forEach(key => {
        const {reactions} = barrels[key];
        processReactions(
          action,
          reactions,
          barrelsReducing[key],
          dispatch,
          getState
        );
      });
    },
    subscribe: subscription => {
      subscriptions.push(subscription);
    },
    unsubscribe: subscription => {
      subscriptions.splice(subscriptions.indexOf(subscription), 1);
    },
    listen: listener => {
      listeners.push(listener);
    },
    stopListening: listener => {
      listeners.splice(listeners.indexOf(listener), 1);
    },
    debug: () => ({
      state,
      listeners,
      subscriptions
    })
  };

  return taverne;
};

// -----------------------------------------------------------------------------

export default createTaverne;
