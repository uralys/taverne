import React, {createContext, useContext} from 'react';

// -----------------------------------------------------------------------------

const DispatcherContext = createContext();

// -----------------------------------------------------------------------------

function useDispatcher() {
  const context = useContext(DispatcherContext);

  if (!context) {
    throw new Error(
      `❌ [hookstores] useDispatcher must be used within a <Dispatcher>`
    );
  }

  return context;
}

// -----------------------------------------------------------------------------

function Dispatcher(props) {
  console.log('☢️ [hookstores] creating the Dispatcher');

  const listeners = [];
  const addActionsListener = listener => listeners.push(listener);

  const dispatch = action => {
    console.log('📡 [hookstores] dispatching', action);
    listeners.forEach(listener => {
      listener.onDispatch(action);
    });
  };

  return (
    <DispatcherContext.Provider
      value={{addActionsListener, dispatch}}
      {...props}
    />
  );
}

// -----------------------------------------------------------------------------

export {Dispatcher, useDispatcher};

// -----------------------------------------------------------------------------
