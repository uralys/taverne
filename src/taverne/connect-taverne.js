// -----------------------------------------------------------------------------

const connectStore = (taverne, onTaverneUpdate) => {
  if (!taverne || !taverne.subscribe || !taverne.unsubscribe) {
    throw new Error('🔴 cannot connect this "taverne"', taverne);
  }

  // initialize the subscriber with current taverne state
  onTaverneUpdate(taverne.getState());

  // register to next store state updates
  taverne.subscribe(onTaverneUpdate);

  return () => {
    taverne.unsubscribe(onTaverneUpdate);
  };
};

// -----------------------------------------------------------------------------

export default connectStore;
