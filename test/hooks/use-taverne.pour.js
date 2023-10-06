// -----------------------------------------------------------------------------

import test from 'ava';
import {renderHook} from '@testing-library/react-hooks';

import createLaTaverne from '../../src/taverne';
import createPourHook from '../../src/hooks/create-pour-hook';

// -----------------------------------------------------------------------------

test('pouring a null result', t => {
  const {taverne} = createLaTaverne({
    bar: {
      initialState: null
    }
  });

  const pour = createPourHook(taverne);
  const {result} = renderHook(() => pour('bar'));

  t.is(result.current, null);
});

// -----------------------------------------------------------------------------

test('pouring a simple string', t => {
  const {taverne} = createLaTaverne({
    bar: {
      initialState: 'ale'
    }
  });

  const pour = createPourHook(taverne);
  const {result} = renderHook(() => pour('bar'));

  t.is(result.current, 'ale');
});

// -----------------------------------------------------------------------------

test('pouring a nested path with dots', t => {
  const {taverne} = createLaTaverne({
    bar: {
      initialState: {ale: {brown: {fresh: 'plenty'}}}
    }
  });

  const pour = createPourHook(taverne);
  const {result} = renderHook(() => pour('bar.ale.brown.fresh'));

  t.is(result.current, 'plenty');
});

// -----------------------------------------------------------------------------

test('pouring properties from an object: e.g. pour({properties})', t => {
  const {taverne} = createLaTaverne({
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

  const pour = createPourHook(taverne);
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

test('pouring with a function to get params inside the state', t => {
  const {taverne} = createLaTaverne({
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

  const pour = createPourHook(taverne);
  const {result} = renderHook(() =>
    pour(state => ({
      title: `shelves.books.${state.navigation.selectedBook}.title`
    }))
  );

  t.deepEqual(result.current, {
    title: 'plup'
  });
});
