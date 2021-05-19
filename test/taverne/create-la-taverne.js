// -----------------------------------------------------------------------------

import test from 'ava';
import createLaTaverne from '../../src/taverne';

// -----------------------------------------------------------------------------

test('simple definition', t => {
  const {taverne, dispatch} = createLaTaverne({});

  t.deepEqual(taverne.initialState, {});
  t.is(typeof dispatch, 'function');
  t.is(typeof taverne.getState, 'function');
  t.is(typeof taverne.setState, 'function');
  t.is(typeof taverne.onDispatch, 'function');
  t.is(typeof taverne.subscribe, 'function');
  t.is(typeof taverne.unsubscribe, 'function');
});

// -----------------------------------------------------------------------------

test('split taverne from barrels names', t => {
  const {taverne} = createLaTaverne({
    plop: {},
    plip: {},
    plup: {}
  });

  t.deepEqual(taverne.initialState, {
    plop: undefined,
    plip: undefined,
    plup: undefined
  });
});

// -----------------------------------------------------------------------------

test('apply initial states', t => {
  const {taverne} = createLaTaverne({
    plop: {initialState: 'ploop'},
    plip: {initialState: 'pliip'},
    plup: {initialState: 'pluup'}
  });

  t.deepEqual(taverne.initialState, {
    plop: 'ploop',
    plip: 'pliip',
    plup: 'pluup'
  });
});
