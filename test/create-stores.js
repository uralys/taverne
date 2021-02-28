const test = require('ava');
const {createStores} = require('../src/index');

test('simple definition', t => {
  const {stores} = createStores({
    plop: ''
  });

  t.is(stores.plop.storeKey, 'plop');
});
