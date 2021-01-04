// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createStore from './lib/create-store';

// -----------------------------------------------------------------------------

const HookstoresContext = createContext();

// -----------------------------------------------------------------------------

const useHookstores = () => {
  const context = useContext(HookstoresContext);

  if (!context) {
    throw new Error(
      `❌ [hookstores] useHookstores must be used within a <Hookstores>`
    );
  }

  return context;
};

// -----------------------------------------------------------------------------

const Hookstores = ({descriptions, children}) => {
  console.log('☢️ [hookstores] creating Hookstores...', descriptions);

  // --------------------------------

  const stores = Object.keys(descriptions).reduce((acc, storeKey) => {
    console.log(`☢️ [hookstores] registering ${storeKey}`);
    const store = createStore(storeKey, descriptions[storeKey]);

    return {
      ...acc,
      [storeKey]: store
    };
  }, {});

  // debug - *will be removed* 🧐
  window.stores = stores;

  // --------------------------------

  const dispatch = action => {
    console.log('📡 [hookstores] dispatching', action);
    Object.keys(stores).forEach(storeKey => {
      stores[storeKey].onDispatch(action);
    });
  };

  // --------------------------------

  return (
    <HookstoresContext.Provider value={{dispatch, ...stores}}>
      {children}
    </HookstoresContext.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Hookstores, useHookstores};

// -----------------------------------------------------------------------------
