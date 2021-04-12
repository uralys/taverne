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
    dispatch({type: `${action.type}/reducing-error`, payload: {error, action}});
    return;
  }

  if (typeof after === 'function') {
    try {
      after(dataToReduce, dispatch, getState);
    } catch (error) {
      dispatch({type: `${action.type}/after-error`, payload: {error, action}});
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
        } catch (e) {
          dispatch({type: `${type}/perform-error`, payload: e});
          return;
        }

        if (result && result.then) {
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

const createReducing = (nestedPath, dispatch, getState, setState) =>
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

  const taverne = {
    initialState,
    getState,
    setState,
    onDispatch: (action, dispatch, getState) => {
      Object.keys(barrels).forEach(key => {
        const applyReducing = createReducing(key, dispatch, getState, setState);
        const {reactions} = barrels[key];
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

  return taverne;
};

// -----------------------------------------------------------------------------

export default createTaverne;
