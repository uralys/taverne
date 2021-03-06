import test from 'ava';
import {useTaverne} from '../../src/hooks/context-provider';

test('pour(field)', t => {
  // const output = pour('plop');
  // const output = pour('any.plop');
  t.truthy(false);
});

test("pour(['fields'])", t => {
  t.truthy(false);
});

test("pour({fromRoot: ['fields']})", t => {
  t.truthy(false);
});

test("pour(state => ({fromRoot: ['fields']})", t => {
  t.truthy(false);
});

test('pour(state => ({other: `nested.${state.selectedStuff}.plop`}))', t => {
  t.truthy(false);
});
