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
      `❌ [hookstores] useTaverne must be used within a provider <Hookstores>`
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
