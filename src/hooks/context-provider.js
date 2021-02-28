// -----------------------------------------------------------------------------
/**
 * ⛵ La Taverne - hooks
 * (c) Uralys, Christophe Dugne-Esquevin
 * https://github.com/uralys/taverne
 * @license MIT
 *
 * 💖 DEPENDENCIES:
 *
 * React
 * (c) Facebook, Inc. and its affiliates.
 * https://github.com/facebook/react
 * @license MIT
 *
 * deep-equal
 * (c) 2012, 2013, 2014 James Halliday <mail@substack.net>, 2009 Thomas Robinson <280north.com>
 * https://github.com/inspect-js/node-deep-equal
 * @license MIT
 */
// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createHooks from './create-hooks';

// -----------------------------------------------------------------------------

const Context = createContext();

// -----------------------------------------------------------------------------

const useTaverne = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      `❌ [La Taverne] useTaverne must be used within a provider <Taverne>`
    );
  }

  return context;
};

// -----------------------------------------------------------------------------

const Taverne = ({dispatch, stores, children}) => {
  const hooks = createHooks(stores);

  return (
    <Context.Provider value={{dispatch, ...hooks}}>{children}</Context.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Taverne, useTaverne};

// -----------------------------------------------------------------------------
