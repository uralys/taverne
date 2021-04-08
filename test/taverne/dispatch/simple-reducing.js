// -----------------------------------------------------------------------------

import test from 'ava';
import createLaTaverne from '../../../src/taverne';

// -----------------------------------------------------------------------------

test('reduce new state on dispatch', t => {
  const {taverne, dispatch} = createLaTaverne({
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

  t.deepEqual(taverne.getState(), {
    counter: {count: 36}
  });
});
