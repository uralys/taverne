import test from 'ava';
import get from '../../src/lib/get';

test('no path should return object', t => {
  const foo = {bar: 1};
  const res = get(null, foo);
  t.deepEqual(res, foo);

  const res2 = get(undefined, foo);
  t.deepEqual(res2, foo);
});

test('unexistant string path', t => {
  const res2 = get('plop.plip.plup', {});
  t.is(res2, undefined);
});

test('nested array', t => {
  const array = [1, 2, 3];
  const plop = {plip: {plup: array}};

  const res = get('plip.plup', plop);
  t.is(res, array);
});
