// -----------------------------------------------------------------------------

import test from 'ava';
import createLaTaverne from '../../../src/stores/create-tavern';

// -----------------------------------------------------------------------------

test('reduce new state on dispatch', t => {
  const {store, dispatch} = createLaTaverne({
    counter: {
      initialState: {count: 0},
      reactions: [
        {
          on: 'add',
          reduce: (state, payload) => {
            const {value} = payload;
            state.count += value;
          }
        }
      ]
    }
  });

  dispatch({type: 'add', payload: {value: 12}});
  dispatch({type: 'add', payload: {value: 12}});
  dispatch({type: 'add', payload: {value: 12}});

  t.deepEqual(store.getState(), {
    counter: {count: 36}
  });
});
