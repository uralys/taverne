# La Taverne

<a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/npm/v/taverne?color=%23123" alt="Current npm package version." /></a> <a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/github/license/uralys/taverne" alt="MIT" /></a> <a href="https://immerjs.github.io/immer/docs/produce"><img src="https://img.shields.io/badge/immer-produce-5908d2.svg" alt="immer" /> </a>

`La Taverne` is an elementary [Flux](https://facebook.github.io/flux/docs/in-depth-overview) implementation to manage a global app state.

It provides an optional, yet easy integration with React using custom **hooks**.

<p align="center"><img  height="280px"  src="./docs/taverne.png"></p>

![action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

## 📦 installation

```sh
> npm i --save taverne
```

## 📓 Create a store

On your app level, a "store" is an `initialState` and a list of `reactions`.

```js
const ADD_BOOK = 'ADD_BOOK';

const addBook = {
  on: ADD_BOOK,
  reduce: (state, payload) => {
    state.nbBooks++;
  }
};

const reactions = [addBook];
const bookStore = {
  initialState: {nbBooks: 0},
  reactions: [addBook]
};

export default bookStore;
export {ADD_BOOK};
```

## 🐿️ Instanciate your tavern

Once your reactions are ready, you can instanciate your `stores` and `dispatch`:

```js
import createLaTaverne from 'taverne';
import bookStore from './features/books/store';
import potionStore from './features/potions/store';
import handcraftStore from './features/handcrafts/store';

const {dispatch, stores} = createLaTaverne({
  bookStore,
  potionStore,
  handcraftStore
});
```

## 🧚 Reactions

```js
const doSomethingInThisStore = {
  on: 'ACTION_TYPE',
  reduce: (state, payload) => {
    /*
      Just update the state with your payload.
      Here, `state` is the draftState used by `Immer.produce`
      You store will then record your next immutable state.
    */
    state.foo = 'bar';
  },
  perform: (parameters, dispatch, getState, stores) => {
    /*
      Optional sync or async function.
      It will be called before `reduce`

      When it is done, reduce will receive the result in
      the `payload` parameter.

      You can `dispatch` next steps from here as well
    */
  }
};
```

- A `reaction` will be triggered when an action is dispatched with `action.type` === `on`.

- `reduce` is called using `Immer`, so mutate the `state` exactly as you would with the `draftState` parameter in [produce](https://immerjs.github.io/immer/docs/produce).

- If you have some business to do before reducing, for example calling an API, use the `perform` function, either `sync` or `async`.

  Then `reduce` will be called with the result once it's done.

## 🎨 React integration

<a href="https://reactjs.org/docs/hooks-custom.html"><img src="https://img.shields.io/badge/react-hooks-5908d2.svg" alt="hooks" /></a>

`La Taverne` has a context Provider and build custom hooks to access you stores anywhere

```js
/* src/app.js */
import React from 'react';
import {render} from 'react-dom';
import {Taverne} from 'taverne/hooks';

render(
  <Taverne dispatch={dispatch} stores={stores}>
    <App id={id} />
  </Taverne>,
  container
);
```

```js
/* src/feature/books/container.js */
import {useTaverne} from 'taverne/hooks';

const BooksContainer = props => {
  const {useBooksStore} = useTaverne();
  const {books} = useBooksStore();

  return <BooksComponent books={books} />;
};
```

See the complete React integration [steps here](docs/react.md).

You can listen to specific parts of specific stores, to allow [accurate local rendering](docs/react.md#-advanced-usage) from your global app state.

## 🔆 Middlewares

You can create more generic middlewares to operate any actions:

```js
const customMiddleware = {
  onCreate: (dispatch, stores) => {},
  onDispatch: (action, dispatch, stores) => {}
};
```

Then instanciate `La Taverne` with your list of middlewares as 2nd parameter:

```js
const {dispatch, stores} = createLaTaverne({bookStore}, [customMiddleware]);
```

example: plugging the [redux devtools extension](https://github.com/reduxjs/redux-devtools) with this [middleware](src/middlewares/devtools.js)

## 🐛 Redux devtools

```js
import createLaTaverne from 'taverne';
import {devtools} from 'taverne/middlewares';
import bookStore from './features/books/store';

const {dispatch, stores} = createLaTaverne({bookStore}, [devtools]);
```

## 🏗️ development

[![devDeps](https://david-dm.org/uralys/taverne/dev-status.svg)](https://david-dm.org/uralys/taverne?type=dev)
[![deps](https://david-dm.org/uralys/taverne/status.svg)](https://david-dm.org/uralys/taverne)

local dev [tips](docs/dev.md)

## ❓ about La Taverne

<a href="https://www.npmjs.com/package/taverne"><img src="https://img.shields.io/github/license/uralys/taverne" alt="MIT" /></a>

📚 Read the project [motivation](docs/motivation.md)

🎨 Tavern drawing: <https://www.deviantart.com/brandonstarr/art/Colored-Pirate-Tavern-210784171>
