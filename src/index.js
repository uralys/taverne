// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createHooks from './create-hooks';
import createStores from './create-stores';

// -----------------------------------------------------------------------------

const HookstoresContext = createContext();

// -----------------------------------------------------------------------------

const useHookstores = () => {
  const context = useContext(HookstoresContext);

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
    <HookstoresContext.Provider value={{dispatch, ...hooks}}>
      {children}
    </HookstoresContext.Provider>
  );
};

// -----------------------------------------------------------------------------

export {createStores, Hookstores, useHookstores};

// -----------------------------------------------------------------------------
