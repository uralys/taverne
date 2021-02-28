import test from 'ava';
import createStores from '../src/stores/create-stores';

test('simple definition', t => {
  const {stores} = createStores({
    plop: ''
  });

  t.is(stores.plop.storeKey, 'plop');
});
