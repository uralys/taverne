import test from 'ava';
import get from '../../src/lib/get';

test('no path should return object', t => {
  const foo = {bar: 1};
  const res = get(null, foo);
  t.deepEqual(res, foo);

  const res2 = get(undefined, foo);
  t.deepEqual(res2, foo);
});
