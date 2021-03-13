// -----------------------------------------------------------------------------

import test from 'ava';
import createLaTaverne from '../../src/stores/create-tavern';

// -----------------------------------------------------------------------------

test('simple definition', t => {
  const {store, dispatch} = createLaTaverne({});

  t.deepEqual(store.initialState, {});
  t.is(typeof dispatch, 'function');
  t.is(typeof store.getState, 'function');
  t.is(typeof store.setState, 'function');
  t.is(typeof store.onDispatch, 'function');
  t.is(typeof store.subscribe, 'function');
  t.is(typeof store.unsubscribe, 'function');
});

// -----------------------------------------------------------------------------

test('split store from reducers names', t => {
  const {store} = createLaTaverne({
    plop: {},
    plip: {},
    plup: {}
  });

  t.deepEqual(store.initialState, {
    plop: undefined,
    plip: undefined,
    plup: undefined
  });
});

// -----------------------------------------------------------------------------

test('apply initial states', t => {
  const {store} = createLaTaverne({
    plop: {initialState: 'ploop'},
    plip: {initialState: 'pliip'},
    plup: {initialState: 'pluup'}
  });

  t.deepEqual(store.initialState, {
    plop: 'ploop',
    plip: 'pliip',
    plup: 'pluup'
  });
});
