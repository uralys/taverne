// -----------------------------------------------------------------------------

import test from 'ava';
import {renderHook} from '@testing-library/react-hooks';

import createLaTaverne from '../../src/stores/create-tavern';
import createPourHook from '../../src/hooks/create-pour-hook';

// -----------------------------------------------------------------------------

test('pour("field")', t => {
  const {store} = createLaTaverne({
    bar: {
      initialState: 'ale'
    }
  });

  const pour = createPourHook(store);
  const {result} = renderHook(() => pour('bar'));

  t.is(result.current, 'ale');
});

// -----------------------------------------------------------------------------

test('pour("nested.path.in.state")', t => {
  const {store} = createLaTaverne({
    bar: {
      initialState: {ale: {brown: {fresh: 'plenty'}}}
    }
  });

  const pour = createPourHook(store);
  const {result} = renderHook(() => pour('bar.ale.brown.fresh'));

  t.is(result.current, 'plenty');
});

// -----------------------------------------------------------------------------

test('pour({fields})', t => {
  const {store} = createLaTaverne({
    bar: {
      initialState: {
        ale: 'plenty',
        milk: 'none'
      }
    },
    shelves: {
      initialState: {
        books: 123,
        comics: 234
      }
    }
  });

  const pour = createPourHook(store);
  const {result} = renderHook(() =>
    pour({
      mug: 'bar.milk',
      books: 'shelves.books'
    })
  );

  t.deepEqual(result.current, {
    mug: 'none',
    books: 123
  });
});

// -----------------------------------------------------------------------------

test('pour(state => {fields})', t => {
  const {store} = createLaTaverne({
    navigation: {
      initialState: {
        selectedBook: 2
      }
    },
    shelves: {
      initialState: {
        books: [
          {title: 'plop', pages: 213},
          {title: 'plip', pages: 2213},
          {title: 'plup', pages: 3213}
        ]
      }
    }
  });

  const pour = createPourHook(store);
  const {result} = renderHook(() =>
    pour(state => ({
      title: `shelves.books.${state.navigation.selectedBook}.title`
    }))
  );

  t.deepEqual(result.current, {
    title: 'plup'
  });
});
