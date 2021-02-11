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
      `❌ [hookstores] useDispatch must be used within a provider <Hookstores>`
    );
  }

  return context;
};

// -----------------------------------------------------------------------------

const Hookstores = ({descriptions, children}) => {
  const {useStore, dispatch} = createStores(descriptions);

  return (
    <HookstoresContext.Provider value={{dispatch, useStore}}>
      {children}
    </HookstoresContext.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Hookstores, useHookstores};

// -----------------------------------------------------------------------------
