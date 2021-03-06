// -----------------------------------------------------------------------------

import React, {createContext, useContext} from 'react';
import createPouring from './create-pouring';

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
  const pour = createPouring(stores);

  return (
    <Context.Provider value={{dispatch, pour}}>{children}</Context.Provider>
  );
};

// -----------------------------------------------------------------------------

export {Taverne, useTaverne};

// -----------------------------------------------------------------------------
