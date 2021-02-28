// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createHooks from './create-hooks';

// -----------------------------------------------------------------------------

const Context = createContext();

// -----------------------------------------------------------------------------

const useHookstores = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      `❌ [hookstores] useHookstores must be used within a provider <Hookstores>`
    );
  }

  return context;
};

// -----------------------------------------------------------------------------

const Hookstores = ({dispatch, stores, children}) => {
  const hooks = createHooks(stores);

  return (
    <Context.Provider value={{dispatch, ...hooks}}>{children}</Context.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Hookstores, useHookstores};

// -----------------------------------------------------------------------------
