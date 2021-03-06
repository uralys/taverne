import test from 'ava';
import createTavern from '../src/stores/create-tavern';

test('simple definition', t => {
  const {stores} = createTavern({
    plop: ''
  });

  t.is(stores.plop.storeKey, 'plop');
});
