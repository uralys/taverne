// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createPourHook from './create-pour-hook';

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

const Taverne = ({dispatch, store, children}) => {
  const pour = createPourHook(store);

  return (
    <Context.Provider value={{dispatch, pour}}>{children}</Context.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Taverne, useTaverne};

// -----------------------------------------------------------------------------
