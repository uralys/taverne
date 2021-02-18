/*
hookstores
(c) Uralys, Christophe Dugne-Esquevin
@license MIT
*/
// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
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

const Hookstores = ({descriptions, children}) => {
  const {dispatch, ...hooks} = createStores(descriptions);

  return (
    <HookstoresContext.Provider value={{dispatch, ...hooks}}>
      {children}
    </HookstoresContext.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Hookstores, useHookstores};

// -----------------------------------------------------------------------------
